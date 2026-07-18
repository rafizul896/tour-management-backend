/* eslint-disable @typescript-eslint/no-explicit-any */
import { uploadBufferToCloudinery } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import generatePdf, { IInvoiceData } from "../../utils/invoice";
import { sendEmail } from "../../utils/sendEmail";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLCommerzService } from "../sslCommerz/sslCommerz.service";
import { ITour } from "../tour/tour.interface";
import { IUser } from "../user/user.interface";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import httpStatus from "http-status-codes";

const initPayment = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId);
  const payment = await Payment.findOne({ booking: bookingId });

  if (!booking) {
    throw new AppError(404, "Booking is not Found!");
  }

  if (!payment) {
    throw new AppError(404, "Payment is not Found!");
  }

  const user: any = booking?.user;

  const sslPayload: ISSLCommerz = {
    address: user.address as string,
    phoneNumber: user.phone as string,
    email: user.email as string,
    name: user.name as string,
    amount: payment?.amount,
    transactionId: payment?.transactionId,
  };

  const sslPayment = await SSLCommerzService.sslPaymentInit(sslPayload);

  return {
    paymentUrl: sslPayment.GatewayPageURL,
  };
};

const getInvliceURL = async (paymentId: string) => {
  const res = await Payment.findById(paymentId).select("invoiceUrl");

  if (!res) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  if (!res.invoiceUrl) {
    throw new AppError(httpStatus.NOT_FOUND, "Invoice not found");
  }

  return res;
};

const successPayment = async (tran_id: string) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: tran_id },
      { status: PAYMENT_STATUS.PAID },
      { runValidators: true, session },
    );

    const booking = await Booking.findByIdAndUpdate(
      {
        _id: updatedPayment?.booking,
      },
      {
        status: BOOKING_STATUS.COMPLETE,
      },
      { new: true, runValidators: true, session },
    )
      .populate("tour", "title")
      .populate("user", "name email");

    const invoiceData: IInvoiceData = {
      transactionId: tran_id,
      totalAmount: updatedPayment?.amount as number,
      bookingDate: booking?.createdAt as Date,
      guestCount: booking?.guestCount as number,
      tourTitle: (booking?.tour as ITour).title,
      userName: (booking?.user as IUser).name,
    };

    const pdfBuffer = (await generatePdf(
      invoiceData,
    )) as Buffer<ArrayBufferLike>;

    const cloudinaryResult = await uploadBufferToCloudinery(
      pdfBuffer,
      "invoice",
    );

    if (!cloudinaryResult) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Error uploading pdf to cloudinary",
      );
    }

    await Payment.findByIdAndUpdate(
      updatedPayment?._id,
      {
        invoiceUrl: cloudinaryResult.secure_url,
      },
      { runValidators: true, session },
    );

    await sendEmail({
      to: (booking?.user as IUser).email,
      subject: "Your Tour Booking Invoice",
      templateName: "invoice",
      templateData: {
        tran_id,
        amount: updatedPayment?.amount,
      },

      attachments: [
        {
          filename: "invoice.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Payment is Completed Successfully",
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
  }
};

const failPayment = async (tran_id: string) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: tran_id },
      { status: PAYMENT_STATUS.FAILED },
      { runValidators: true, session },
    );

    await Booking.findByIdAndUpdate(
      {
        _id: updatedPayment?.booking,
      },
      {
        status: BOOKING_STATUS.FAILED,
      },
      { runValidators: true, session },
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: false,
      message: "Payment is Failed",
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
  }
};

const cancelPayment = async (tran_id: string) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: tran_id },
      { status: PAYMENT_STATUS.CANCELLED },
      { runValidators: true, session },
    );

    await Booking.findByIdAndUpdate(
      {
        _id: updatedPayment?.booking,
      },
      {
        status: BOOKING_STATUS.CANCEL,
      },
      { runValidators: true, session },
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: false,
      message: "Payment is Cancelled",
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
  }
};

export const PaymentService = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
  getInvliceURL,
};
