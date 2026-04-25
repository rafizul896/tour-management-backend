/* eslint-disable @typescript-eslint/no-unused-vars */
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { TourService } from "./tour.service";
import httpStatus from "http-status-codes";

const createTourType = catchAsync(async (req, res, next) => {
  const result = await TourService.createTourType(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "TourType is created",
    data: result,
  });
});

const getAllTourTypes = catchAsync(async (req, res, next) => {
  const result = await TourService.getAllTourTypes();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "TourType is retrieved successfully",
    data: result,
  });
});

const updateTourType = catchAsync(async (req, res, next) => {
  const id = req.params.id as string;
  const result = await TourService.updateTourType(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "TourType is updated successfully",
    data: result,
  });
});

const deleteTourType = catchAsync(async (req, res, next) => {
  const id = req.params.id as string;
  const result = await TourService.deleteTourType(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "TourType is deleted successfully",
    data: result,
  });
});

const createTour = catchAsync(async (req, res, next) => {
  const result = await TourService.createTour(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Tour is created",
    data: result,
  });
});

const getAllTours = catchAsync(async (req, res, next) => {
  const query = req.query;
  const result = await TourService.getAllTours(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tours are retrieved successfully",
    meta: result?.meta,
    data: result.tours,
  });
});

const getSingleTour = catchAsync(async (req, res, next) => {
  const id = req.params.id as string;
  const result = await TourService.getSingleTour(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour is retrieved successfully",
    data: result,
  });
});

const updateTour = catchAsync(async (req, res, next) => {
  const id = req.params.id as string;
  const result = await TourService.updateTour(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour is updated successfully",
    data: result,
  });
});

const deleteTour = catchAsync(async (req, res, next) => {
  const id = req.params.id as string;

  const result = await TourService.deleteTour(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour is deleted successfully",
    data: result,
  });
});

export const TourController = {
  createTourType,
  getAllTourTypes,
  updateTourType,
  deleteTourType,
  createTour,
  getAllTours,
  getSingleTour,
  updateTour,
  deleteTour,
};
