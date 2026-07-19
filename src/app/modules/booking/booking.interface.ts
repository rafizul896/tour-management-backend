import { Types } from "mongoose";
import { ITour } from "../tour/tour.interface";
import { IUser } from "../user/user.interface";

export enum BOOKING_STATUS {
  PENDING = "PENDING",
  CANCEL = "CANCEL",
  COMPLETE = "COMPLETE",
  FAILED = "FAILED",
}

export interface IBooking {
  user: Types.ObjectId | IUser;
  tour: Types.ObjectId | ITour;
  payment?: Types.ObjectId;
  guestCount: number;
  status: BOOKING_STATUS;
  createdAt?: Date;
}
