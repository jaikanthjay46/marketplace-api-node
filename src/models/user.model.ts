import * as argon2 from "argon2";
import { BadRequest } from 'http-errors';
import { Op, Transaction } from 'sequelize';
import {
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  Column,
  Comment,
  CreatedAt,
  DataType,
  Default,
  DefaultScope,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { UserRoleEnum } from '../types/enums';
import { generateSignedJWT } from '../utils';
import CatalogModel from "./catalog.model";

@DefaultScope(() => ({
  attributes: {
    exclude: ['password'],
  },
}))
@Table({
  charset: 'utf8',
  collate: 'utf8_general_ci',
  tableName: 'user',
})
export default class UserModel extends Model<UserModel> {
  // Model Attributes

  @PrimaryKey
  @AllowNull(false)
  @Comment('ID of the user')
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Unique
  @AllowNull(false)
  @Comment('Username of the user')
  @Column(DataType.STRING(128))
  username!: string;

  @AllowNull(false)
  @Comment('Password of the user')
  @Column(DataType.STRING(64))
  password!: string;

  @AllowNull(false)
  @Comment('User role')
  @Column(DataType.ENUM(...Object.values(UserRoleEnum)))
  role!: UserRoleEnum;

  @CreatedAt
  @AllowNull(false)
  @Comment("Date and time of the user's creation date")
  @Column(DataType.DATE)
  createdAt!: string;

  @HasMany(() => CatalogModel)
  catalogues!: CatalogModel[];


  // Model Hooks

  @BeforeCreate
  @BeforeUpdate
  static async checkUsernameUniqueness(
    user: UserModel,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    if (user.changed('username')) {
      const username = user.getDataValue('username');
      const usernameCount = await UserModel.count({
        where: {
          id: { [Op.ne]: user.id },
          username,
        },
        transaction: options?.transaction,
      });

      if (usernameCount > 0) {
        throw new BadRequest('An account with this username already exists.');
      }
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(user: UserModel): Promise<void> {
    if (user.changed('password')) {
      const password = user.getDataValue('password');
      const hash = await UserModel.generateHash(password);

      user.password = hash;
    }
  }

  // Methods

  /**
   * Returns a hashed version of the given `password`.
   */
  static async generateHash(password: string): Promise<string> {
    return argon2.hash(password);
  }

  /**
   * Returns `true` if `password` matches the user's password, `false` otherwise.
   */
  async comparePassword(password: string): Promise<boolean> {
    return argon2.verify(this.password, password);
  }

  /**
   * Returns a new JWT for this user.
   */
  async generateJWT(transaction?: Transaction): Promise<string> {
    const user = await UserModel.findByPk(this.id, {
      attributes: {
        include: ['id', 'username', 'password', 'role'],
      },
      transaction,
    });

    if (!user) {
      throw new Error(`User not found with id '${this.id}'`);
    }

    return generateSignedJWT(user.id, user.password, {
      username: user.username,
      role: user.role,
    });
  }
}
