import { z } from "zod";
import { IsActive, Role } from "./user.interface";

export const userSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least one letter and one number",
    )
    .optional(),
  phone: z
    .string()
    .regex(/^(?:\+8801|8801|01)[3-9]\d{8}$/, "Invalid Bangladeshi phone number")
    .optional(),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address too long")
    .optional(),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
    .optional(),
  phone: z
    .string()
    .regex(/^(?:\+8801|8801|01)[3-9]\d{8}$/, "Invalid Bangladeshi phone number")
    .optional(),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address too long")
    .optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),
  isActive: z.enum(Object.keys(IsActive) as [string]).optional(),
  isDeleted: z
    .boolean({ message: "isDeleted must be true or false" })
    .optional(),
  isVerified: z
    .boolean({ message: "isVerified must be true oe false" })
    .optional(),
});
