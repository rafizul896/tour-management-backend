import mongoose, { Types } from "mongoose";
import { Division } from "../division/division.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { Guide } from "./guide.model";
import { GUIDE_STATUS } from "./guide.interface";
import { User } from "../user/user.model";
import { Role } from "../user/user.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";

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

const updateApplicationStatus = async (id: string, status: GUIDE_STATUS) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const application = await Guide.findById(id).session(session);

    if (!application) {
      throw new AppError(httpStatus.NOT_FOUND, "Guide application not found");
    }

    if (application.status !== GUIDE_STATUS.PENDING) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `This application is already ${application.status.toLowerCase()}; only a pending application can be ${status.toLowerCase()}`,
      );
    }

    const res = await Guide.findByIdAndUpdate(
      id,
      { status },
      { runValidators: true, session },
    );

    await User.findByIdAndUpdate(
      application.user,
      { role: Role.GUIDE },
      { session },
    );

    await session.commitTransaction();
    return res;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

const getAllGuideApplications = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(Guide.find(), query);

  const data = await queryBuilder.filter().fields().sort().paginate().build();

  const meta = await queryBuilder.getMeta();

  return {
    data,
    meta,
  };
};

const getSingleGuideApplication = async (id: string) => {
  const isExist = await Guide.findOne({
    _id: id,
    status: { $ne: "DELETED" },
  })
    .populate("user", "name email role")
    .populate("division", "name");

  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Guide application not found");
  }

  return isExist;
};

const softDeleteGuide = async (id: string) => {
  const guide = await Guide.findById(id);

  if (!guide) {
    throw new AppError(httpStatus.NOT_FOUND, "Guide is not found");
  }

  await Guide.findByIdAndUpdate(id, {
    status: GUIDE_STATUS.DELETED,
  });

  return;
};

export const GuideServices = {
  applyForGuide,
  updateApplicationStatus,
  getAllGuideApplications,
  getSingleGuideApplication,
  softDeleteGuide,
};
