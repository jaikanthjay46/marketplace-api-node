import Router from 'express-promise-router';
import { Container } from 'typedi';
import { auth } from '../middlewares';
import CatalogService from '../services/catalog.service';
import OrderService from '../services/order.service';
import { Catalog, CreateCatalogDTO } from '../types';

const router = Router();

/**
 * GET /seller/orders
 *
 * List of Orders
 */
router.get('/orders', auth.required, async (req, res) => {

    const orders = await Container.get(OrderService).getOrdersForUser(req.user?.id as string);

    res.status(200).json({ data: orders });
  },
);


/**
 * POST /seller/create-catalog
 *
 * Create new Order
 */

router.post<{}, Catalog, CreateCatalogDTO>(
  '/create-catalog',
  auth.required,
  async (req, res) => {
    const userId = req.user?.id as string;
    const { products } = req.body;

    const order = await Container.get(CatalogService).createCatalogForUser(userId, products);

    res.status(201).json(order);
  },
);

export default router;
