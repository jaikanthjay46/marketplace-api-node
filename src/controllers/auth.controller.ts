import Router from 'express-promise-router';
import { Container } from 'typedi';
import { validation } from '../middlewares';
import { AuthService, UserService } from '../services';
import { CreateUserDTO, LoginDTO, User } from '../types';

const router = Router();

/**
 * POST /auth/login
 *
 * Authenticate user
 */
router.post<{}, { token: string }, LoginDTO>(
  '/login',
  validation.celebrate({
    body: {
      username: validation.schemas.username.required(),
      password: validation.schemas.password.required(),
    },
  }),
  async (req, res) => {
    const { username, password } = req.body;

    const token = await Container.get(AuthService).login(username, password);

    res.status(200).json({ token });
  },
);

/**
 * POST /auth/register
 *
 * Create new user
 */

router.post<{}, User, CreateUserDTO>(
  '/register',
  validation.celebrate({
    body: validation.Joi.object({
      username: validation.schemas.username.required(),
      role: validation.schemas.role.required(),
      password: validation.schemas.password.required(),
    }).required(),
  }),
  async (req, res) => {
    const userDetails = req.body;

    const user = await Container.get(UserService).createUser(userDetails);

    res.status(201).json(user);
  },
);

export default router;
