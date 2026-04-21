import AppError from "../../errorHelpers/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import httpStatus from "http-status-codes";

const createDivision = async (payload: IDivision) => {
  const isExistDivision = await Division.findOne({ name: payload.name });

  if (isExistDivision) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "A divison with this name is Already Exist",
    );
  }

  const division = await Division.create(payload);
  return division;
};

const getAllDivision = async () => {
  const divisions = await Division.find({});

  return divisions;
};

const getSingleDivision = async (id: string) => {
  const division = await Division.findOne({ slug: id });

  return division;
};

const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  const isExistDivision = await Division.findById(id);

  if (!isExistDivision) {
    throw new AppError(httpStatus.NOT_FOUND, "Division is Not found!");
  }

  const isDuplicateDivition = await Division.findOne({
    name: payload.name,
    _id: { $ne: id },
  });

  if (isDuplicateDivition) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "A Division is Exist using this name",
    );
  }

  const updatedDivision = await Division.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedDivision
};

const deleteDivision = async (id: string) => {
  await Division.findByIdAndDelete(id);

  return null;
};

export const DivisionService = {
  createDivision,
  getAllDivision,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
