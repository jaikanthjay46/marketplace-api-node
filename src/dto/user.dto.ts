import { UserModel } from '../models';
import { User } from '../types';

export const userDTO = (user: UserModel): User => {
  const userDto: User = {
    username: user.username,
    role: user.role,
    createdAt: user.createdAt,
  };

  return userDto;
};
