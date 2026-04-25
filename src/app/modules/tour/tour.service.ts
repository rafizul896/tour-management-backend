import AppError from "../../errorHelpers/AppError";
import { IMeta } from "../../utils/sendResponse";
import { excludeField, tourSearchableFields } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
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
const createTour = async (payload: ITour) => {
  const isExisTour = await Tour.findOne({ name: payload.title });

  if (isExisTour) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour is already exists");
  }

  return await Tour.create(payload);
};

const getAllTours = async (query: Record<string, unknown>) => {
  const filter = query;
  const searchTerm = query?.searchTerm || "";
  const sortBy = (query?.sortBy as string) || "createdAt";
  const fields = (query?.fields as string)?.split(",").join(" ");
  const limit = Number(query.limit) || 10;
  const page = Number(query.page) || 1;
  const skip = (page - 1) * limit;

  for (const field of excludeField) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete filter[field];
  }

  const seachQuery = {
    $or: tourSearchableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    })),
  };

  const tours = await Tour.find(seachQuery)
    .find(filter)
    .sort(sortBy)
    .select(fields)
    .limit(limit)
    .skip(skip);

  const totalTours = await Tour.countDocuments();
  const meta: IMeta = {
    page,
    limit,
    total: totalTours,
    totalPage: Math.ceil(totalTours / limit),
  };

  return {
    tours,
    meta,
  };
};

const getSingleTour = async (id: string) => {
  const tour = await Tour.findById(id);

  if (!tour) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour is not not found!");
  }

  return tour;
};

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const tour = await Tour.findById(id);

  if (!tour) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour is not not found!");
  }

  return await Tour.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteTour = async (id: string) => {
  const tour = await Tour.findById(id);

  if (!tour) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour is not not found!");
  }

  return await Tour.findByIdAndDelete(id);
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
