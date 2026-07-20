/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { envVars } from "../../config/env";
import { ISSLCommerz } from "./sslCommerz.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { Payment } from "../payment/payment.model";

const sslPaymentInit = async (payload: ISSLCommerz) => {
  try {
    const data = {
      store_id: envVars.SSL.SSL_STORE_ID,
      store_passwd: envVars.SSL.SSL_STORE_PASS,
      total_amount: payload.amount,
      currency: "BDT",
      tran_id: payload.transactionId,
      success_url: `${envVars.SSL.SSL_SUCCESS_BACKEND_URL}?tran_id=${payload.transactionId}&amount=${payload.amount}&status=success`,
      fail_url: `${envVars.SSL.SSL_FAIL_BACKEND_URL}?tran_id=${payload.transactionId}&amount=${payload.amount}&status=fail`,
      cancel_url: `${envVars.SSL.SSL_CANCEL_BACKEND_URL}?tran_id=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
      ipn_ur: envVars.SSL.SSL_IPN_URL,
      shipping_method: "N/A",
      product_name: "Tour",
      product_category: "Service",
      product_profile: "general",
      cus_name: payload.name,
      cus_email: payload.email,
      cus_add1: payload.address,
      cus_add2: "N/A",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: payload.phoneNumber,
      cus_fax: "01709090909",
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: 1000,
      ship_country: "N/A",
    };

    const res = await axios({
      method: "POST",
      url: envVars.SSL.SSL_PAYMENT_API,
      data: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return res.data;
  } catch (err) {
    if (err instanceof Error) {
      throw new AppError(httpStatus.BAD_REQUEST, err.message);
    }
  }
};

const validatePayment = async (payload: any) => {
  try {
    console.log("IPN-SSL", payload);
    const res = await axios({
      method: "GET",
      url: `${envVars.SSL.SSL_VALIDATION_API}?val_id=${payload.val_id}&store_id=${envVars.SSL.SSL_STORE_ID}&store_passwd=${envVars.SSL.SSL_STORE_PASS}`,
    });

    return await Payment.updateOne(
      {
        transactionId: payload.tran_id,
      },
      { paymentGatewayData: res.data },
      { runValidators: true },
    );
  } catch (err) {
    console.log({ err });
    if (err instanceof Error) {
      throw new AppError(401, err?.message);
    }
  }
};

export const SSLCommerzService = {
  sslPaymentInit,
  validatePayment,
};
