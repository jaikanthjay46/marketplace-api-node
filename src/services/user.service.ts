import { BadRequest, NotFound } from 'http-errors';
import { Service } from 'typedi';
import { userDTO } from '../dto';
import { UserModel } from '../models';
import { CreateUserDTO, User } from '../types';
import { UserRoleEnum } from '../types/enums';

@Service()
export default class UserService {
  /**
   * Returns the details of a user or throws a `NotFound` error if not found.
   */
  async getUserByUsername(username: string): Promise<User> {
    const user = await UserModel.findOne({where: { username }});

    if (!user) {
      throw new NotFound('User not found.');
    }

    return userDTO(user);
  }

  /**
   * Returns tall users by UserRoleEnum
   */
  async getUsersByRole(role: UserRoleEnum): Promise<User[]> {
    const users = await UserModel.findAll({where: { role }});

    return users.map(user => userDTO(user));
  }

  /**
   * Creates a new user or throws a `BadRequest` error if a user with the same username already exists.
   */
  async createUser(userDetails: CreateUserDTO): Promise<User> {
    const existingUser = await UserModel.findOne({ where: { username: userDetails.username } });

    if (existingUser) {
      throw new BadRequest('An account with this username already exists.');
    }

    const user = await UserModel.create(userDetails);

    return userDTO(user);
  }
}
