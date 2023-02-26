import { ErrorRequestHandler, Request } from 'express';
import jwt, { UnauthorizedError } from 'express-jwt';
import createHttpError from 'http-errors';
import { UserModel } from '../models';
import { AuthUser, DecodedJWT } from '../types';
import { getJwtSecret } from '../utils';

/**
 * Callback used to dynamically retrieve the secret used to sign a JWT.
 */
const secretCallback = (
  req: Request,
  payload: DecodedJWT,
  done: (err: any, secret: string) => void,
) => {
  const message = 'Invalid authentication.';

  if (!payload || !payload.sub) {
    return done(new UnauthorizedError('invalid_token', { message }), '');
  }

  const { sub: userId } = payload;

  return UserModel.findByPk(userId, { attributes: ['id', 'username', 'password', 'role'] })
    .then(user => {
      if (!user) {
        return done(new UnauthorizedError('invalid_token', { message }), '');
      }

      const { password, ...authUser } = user.get({ plain: true }) as AuthUser & {
        password: string;
      };

      // Add user details to request object
      req.user = authUser as AuthUser;

      // Retrieve secret used to sign token
      const secret = getJwtSecret(user.password);

      return done(null, secret);
    })
    .catch((err: any) => done(err, ''));
};

/**
 * Express request handler that verifies if a valid token exists through an `Authorization` header.
 *
 * Decoded payload will then be available in `req.user`.
 *
 * @example
 * router.get('/users', auth.required, usersController.getUsers);
 */
export const auth = {
  required: jwt({
    algorithms: ['HS256'],
    secret: secretCallback,
    requestProperty: 'auth',
  }),
  optional: jwt({
    algorithms: ['HS256'],
    secret: secretCallback,
    credentialsRequired: false,
    requestProperty: 'auth',
  }),
};

/**
 * Middleware used to parse `JWT` authentication errors.
 */
export const jwtErrorHandler = (): ErrorRequestHandler => {
  return (err, req, res, next) => {
    if (err instanceof UnauthorizedError) {
      const message = 'Invalid authentication.';

      return next(createHttpError(401, err, { message }));
    }

    return next(err);
  };
};
