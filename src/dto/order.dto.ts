import { OrdersModel } from '../models';
import { Catalog, Order } from '../types';
import { catalogDTO } from './catalog.dto';

export const orderDTO = (order: OrdersModel): Order => {
  const orderDTO: Order = {
    id: order.id,
    address: order.address,
    catalogues: order.catalogues.map( catalog => catalogDTO(catalog) )
  };

  return orderDTO;
};
