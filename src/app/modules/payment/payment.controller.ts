/* eslint-disable @typescript-eslint/no-unused-vars */
import { envVars } from "../../config/env";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SSLCommerzService } from "../sslCommerz/sslCommerz.service";
import { PaymentService } from "./payment.service";
import httpStatus from "http-status-codes";

const initPayment = catchAsync(async (req, res, next) => {
  const bookingId = req.params.bookingId as string;
  const result = await PaymentService.initPayment(bookingId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Payment Done successfully",
    data: result,
  });
});

const getInvliceURL = catchAsync(async (req, res, next) => {
  const paymentId = req.params.paymentId as string;
  const result = await PaymentService.getInvliceURL(paymentId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment invliceUrl retrived successfully",
    data: result,
  });
});

const successPayment = catchAsync(async (req, res, next) => {
  const query = req.query;
  const result = await PaymentService.successPayment(query.tran_id as string);

  if (result?.success) {
    res.redirect(
      `${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?tran_id=${query.tran_id}&message=${result.message}&amount=${query.amount}&status=${query.status}`,
    );
  }
});

const failPayment = catchAsync(async (req, res, next) => {
  const query = req.query;
  const result = await PaymentService.failPayment(query.tran_id as string);

  if (result?.success === false) {
    res.redirect(
      `${envVars.SSL.SSL_FAIL_FRONTEND_URL}?tran_id=${query.tran_id}&message=${result.message}&amount=${query.amount}&status=${query.status}`,
    );
  }
});

const cancelPayment = catchAsync(async (req, res, next) => {
  const query = req.query;
  const result = await PaymentService.cancelPayment(query.tran_id as string);

  if (result?.success === false) {
    res.redirect(
      `${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?tran_id=${query.tran_id}&message=${result.message}&amount=${query.amount}&status=${query.status}`,
    );
  }
});

const validatePaymnet = catchAsync(async (req, res, next) => {
  const result = await SSLCommerzService.validatePayment(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: false,
    message: "Payment Validated successfully!",
    data: result
  })
});

export const PaymentController = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
  getInvliceURL,
  validatePaymnet
};
