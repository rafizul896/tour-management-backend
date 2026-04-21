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

const getAllDivision = async (payload: IDivision) => {
  console.log(payload);
};

const getSingleDivision = async (payload: IDivision) => {
  console.log(payload);
};

const updateDivision = async (payload: IDivision) => {
  console.log(payload);
};

const deleteDivision = async (payload: IDivision) => {
  console.log(payload);
};

export const DivisionService = {
  createDivision,
  getAllDivision,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
