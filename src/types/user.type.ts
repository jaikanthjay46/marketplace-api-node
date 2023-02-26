import { UserRoleEnum } from "./enums";

export type User = {
  username: string;
  role: UserRoleEnum;
  createdAt: string;
};

export type CreateUserDTO = {
  username: string;
  role: UserRoleEnum;
  password: string;
};
