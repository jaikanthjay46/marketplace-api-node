import { BadRequest } from 'http-errors';
import { Op, Transaction } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  BelongsToMany,
  Column,
  Comment,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript';
import OrdersModel, { OrderItems } from './orders.model';
import ProductModel from './product.model';
import UserModel from './user.model';

@Table({
  charset: 'utf8',
  collate: 'utf8_general_ci',
  tableName: 'catalog',
})
export default class CatalogModel extends Model<CatalogModel> {
  // Model Attributes

  @PrimaryKey
  @AllowNull(false)
  @Comment('ID of the Product')
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => UserModel)
  @Column(DataType.UUID)
  sellerId!: string;

  @BelongsTo(() => UserModel)
  seller!: UserModel;

  @HasMany(() => ProductModel)
  products!: ProductModel[];


  @CreatedAt
  @AllowNull(false)
  @Column(DataType.DATE)
  createdAt!: string;
}
