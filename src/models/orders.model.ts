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
import ProductModel from './product.model';
import UserModel from './user.model';

@Table({
  charset: 'utf8',
  collate: 'utf8_general_ci',
  tableName: 'orders',
})
export default class OrdersModel extends Model<OrdersModel> {
  // Model Attributes

  @PrimaryKey
  @AllowNull(false)
  @Comment('ID of the Product')
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING(128))
  address!: string;

  @ForeignKey(() => UserModel)
  @Column(DataType.UUID)
  sellerId!: string;

  @BelongsToMany(() => ProductModel, () => OrderItems)
  products!: ProductModel[];

  @CreatedAt
  @AllowNull(false)
  @Comment("Date and time of the order creation date")
  @Column(DataType.DATE)
  createdAt!: string;
}


// Many-to-Many Normalisation Table
@Table
export class OrderItems extends Model {
  @ForeignKey(() => OrdersModel)
  @Column(DataType.UUID)
  orderId!: string;

  @ForeignKey(() => ProductModel)
  @Column(DataType.UUID)
  productId!: string;
}
