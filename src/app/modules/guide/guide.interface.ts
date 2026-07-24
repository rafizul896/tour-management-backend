import { Types } from "mongoose";
import { IUser } from "../user/user.interface";
import { IDivision } from "../division/division.interface";

export enum GUIDE_STATUS {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  DELETED = "DELETED",
}

export interface IGuide {
  user: Types.ObjectId | IUser;
  nidPhoto: string;
  division: Types.ObjectId | IDivision;
  status: GUIDE_STATUS;
}
