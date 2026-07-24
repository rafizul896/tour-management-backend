import mongoose, { Types } from "mongoose";
import { Division } from "../division/division.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { Guide } from "./guide.model";

const applyForGuide = async (payload: {
  user: Types.ObjectId;
  division: Types.ObjectId;
  nidPhoto: string;
}) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const division = await Division.findById(payload.division).session(session);

    if (!division) {
      throw new AppError(httpStatus.NOT_FOUND, "Division not found");
    }

    const isExistGuide = await Guide.findOne({ user: payload.user }).session(
      session,
    );

    if (isExistGuide) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You have already submitted a guide application",
      );
    }

    const res = await Guide.create([payload], { session });
    await session.commitTransaction();

    return res[0];
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

const updateApplicationStatus = async (id: string, status) => {
  console.log("hey");
};

const getAllGuideApplications = async (query: Record<string, unknown>) => {};

const getSingleGuideApplication = async (id: string) => {
  console.log(id);
};

const softDeleteGuide = async (id: string) => {
  console.log(id);
};

export const GuideServices = {
  applyForGuide,
  updateApplicationStatus,
  getAllGuideApplications,
  getSingleGuideApplication,
  softDeleteGuide,
};
