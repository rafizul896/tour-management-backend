import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const user = await User.create(payload);

  return user;
};

const getAllUsers = async () => {
  const users = User.find({});
  
  return users;
};

export const UserServices = {
  createUser,
  getAllUsers,
};
