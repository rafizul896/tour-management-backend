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
  //
};

const getSingleDivision = async (id: string) => {
  console.log(id);
};

const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  console.log(payload);
};

const deleteDivision = async (id: string) => {
  console.log(id);
};

export const DivisionService = {
  createDivision,
  getAllDivision,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
