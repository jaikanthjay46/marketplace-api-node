import { NotFound } from 'http-errors';
import { Service } from 'typedi';
import { orderDTO } from '../dto/order.dto';
import { CatalogModel, OrdersModel } from '../models';
import ProductModel from '../models/product.model';
import { Catalog, Order } from '../types';

@Service()
export default class OrderService {
  /**
   * Returns the catalog of a seller or throws a `NotFound` error if not found.
   */
  async createOrderForSeller(sellerId: string, productIds: string[], address: string): Promise<Order> {

    const catalog = await CatalogModel.findOne({where: {sellerId}});

    if (!catalog) {
      throw new NotFound('Seller does not have a catalog');
    }

    const order = new OrdersModel();
    order.address = address;
    order.sellerId = sellerId;
    order.save();

    const catalogues$ = productIds.map( async (productId) => {
      const product = await ProductModel.findOne({where: { catalogId: catalog.id, id: productId }});
      if (!product) {
        return;
      }
      return order.$add('products', product)
    })

    Promise.all(catalogues$);

    return orderDTO(order);
  }

  /**
   * Gets a list of orders for user
   */
  async getOrdersForUser(userId: string): Promise<Order[]> {


    const orders = await OrdersModel.findAll({where: { sellerId: userId}});


    return orders.map( order => orderDTO(order));
  }

}
