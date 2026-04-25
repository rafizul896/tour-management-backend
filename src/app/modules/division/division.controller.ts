/* eslint-disable @typescript-eslint/no-unused-vars */
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { DivisionService } from "./division.service";
import httpStatus from "http-status-codes";

const createDivision = catchAsync(async (req, res, next) => {
  const data = req.body;
  const division = await DivisionService.createDivision(data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Division is Created",
    data: division,
  });
});

const getAllDivision = catchAsync(async (req, res, next) => {
  const data = await DivisionService.getAllDivision();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Division is Retrieved",
    data,
  });
});

const getSingleDivision = catchAsync(async (req, res, next) => {
  const slug = req.params.slug as string;
  const data = await DivisionService.getSingleDivision(slug);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Division is Retrieved",
    data,
  });
});

const updateDivision = catchAsync(async (req, res, next) => {
  const id = req.params.id as string;
  const payload = req.body;
  const data = await DivisionService.updateDivision(id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Division is updated",
    data,
  });
});

const deleteDivision = catchAsync(async (req, res, next) => {
  const id = req.params.id as string;
  const data = await DivisionService.deleteDivision(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Division is deleted",
    data,
  });
});

export const DivisionControllers = {
  createDivision,
  getAllDivision,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
