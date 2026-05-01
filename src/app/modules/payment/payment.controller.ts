/* eslint-disable @typescript-eslint/no-unused-vars */
import { envVars } from "../../config/env";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";
import httpStatus from "http-status-codes";

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

export const PaymentController = {
  successPayment,
  failPayment,
  cancelPayment,
};
