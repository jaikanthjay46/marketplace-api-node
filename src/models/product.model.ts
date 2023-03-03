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
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript';
import CatalogModel from './catalog.model';
import OrdersModel, { OrderItems } from './orders.model';
import UserModel from './user.model';

@Table({
  charset: 'utf8',
  collate: 'utf8_general_ci',
  tableName: 'products',
})
export default class ProductModel extends Model<ProductModel> {
  // Model Attributes

  @PrimaryKey
  @AllowNull(false)
  @Comment('ID of the Product')
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING(128))
  name!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  price!: string;

  @ForeignKey(() => CatalogModel)
  @Column(DataType.UUID)
  catalogId!: string;

  @BelongsTo(() => CatalogModel)
  catalog!: CatalogModel;

  @BelongsToMany(() => OrdersModel, () => OrderItems)
  orders!: OrdersModel[];


  @CreatedAt
  @AllowNull(false)
  @Column(DataType.DATE)
  createdAt!: string;
}
