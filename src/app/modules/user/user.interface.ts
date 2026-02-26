import { Types } from "mongoose";

export enum Role {
  USER = "USER",
  GUIDE = "GUIDE",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export interface IAuthProvider {
  provider: string;
  providerId: string;
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: boolean;
  isActive?: IsActive;
  isVerified?: boolean;

  auths: IAuthProvider[];
  role: Role;
  bookings: Types.ObjectId[];
  guides?: Types.ObjectId[];
}
