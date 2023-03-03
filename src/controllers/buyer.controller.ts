import Router from 'express-promise-router';
import { Container } from 'typedi';
import { validation } from '../middlewares';
import { AuthService, UserService } from '../services';
import CatalogService from '../services/catalog.service';
import OrderService from '../services/order.service';
import { CreateOrderDTO, CreateUserDTO, LoginDTO, Order, User } from '../types';
import { UserRoleEnum } from '../types/enums';

const router = Router();

/**
 * GET /buyer/list-of-sellers
 *
 * List of sellers
 */
router.get('/list-of-sellers', async (req, res) => {

    const users = await Container.get(UserService).getUsersByRole(UserRoleEnum.Seller);

    res.status(200).json({ data: users });
  },
);

/**
 * GET /buyer/seller-catalog/:sellerId
 *
 * Get catalog of seller
 */
router.get('/seller-catalog/:sellerId', async (req, res) => {

  const sellerId = req.params.sellerId;

  const catalogues = await Container.get(CatalogService).getCatalogByUser(sellerId);

  res.status(200).json({ data: catalogues });
},
);

/**
 * POST /buyer/create-order/:sellerId
 *
 * Create new Order
 */

router.post<{sellerId: string}, Order, CreateOrderDTO>(
  '/create-order/:sellerId',
  validation.celebrate({
    body: validation.Joi.object({
      username: validation.schemas.username.required(),
      role: validation.schemas.role.required(),
      password: validation.schemas.password.required(),
    }).required(),
  }),
  async (req, res) => {
    const sellerId = req.params.sellerId;
    const {address, productIds} = req.body;

    const order = await Container.get(OrderService).createOrderForSeller(sellerId, productIds, address);

    res.status(201).json(order);
  },
);

export default router;
