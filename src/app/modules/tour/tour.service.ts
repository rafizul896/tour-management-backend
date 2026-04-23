import AppError from "../../errorHelpers/AppError";
import { ITourType } from "./tour.interface";
import { TourType } from "./tour.model";
import httpStatus from "http-status-codes";

// --- For TourType --- //
const createTourType = async (payload: ITourType) => {
  const isExisTourType = await TourType.findOne({ name: payload.name });

  if (isExisTourType) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour type is already exists");
  }

  return await TourType.create(payload);
};

const getAllTourTypes = async () => {
  return await TourType.find();
};

const updateTourType = async (id: string, payload: ITourType) => {
  const isExisTourType = await TourType.findById(id);

  if (!isExisTourType) {
    throw new Error("Tour type is not founded!");
  }

  return await TourType.findByIdAndUpdate(id, payload, {
    new: true,
  });
};

const deleteTourType = async (id: string) => {
  const isExisTourType = await TourType.findById(id);

  if (!isExisTourType) {
    throw new Error("Tour type is not founded!");
  }

  return await TourType.findByIdAndDelete(id);
};

// --- For Tour --- //
const createTour = async () => {
  //
};

const getAllTours = async () => {
  //
};

const getSingleTour = async () => {
  //
};

const updateTour = async () => {
  //
};

const deleteTour = async () => {
  //
};

export const TourService = {
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
