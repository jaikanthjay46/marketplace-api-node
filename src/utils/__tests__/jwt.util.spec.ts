import * as argon2 from "argon2"
import jwt from 'jsonwebtoken';
import Container from 'typedi';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../config';
import { UserRoleEnum } from '../../types/enums';
import { generateSignedJWT, getJwtSecret } from '../jwt.util';

const JWT_SECRET = 'jwt-secret';
const PUBLIC_HOST = 'http://localhost:8080';

describe('jwt.util', () => {
  let hash: string;

  beforeAll(async () => {
    config.publicHost = PUBLIC_HOST;
    config.jwt.secret = JWT_SECRET;

    Container.set('config', config);

    hash = await argon2.hash('fake-password');
  });

  describe('getJwtSecret()', () => {
    it('should return a JWT secret', () => {
      const jwtSecret = getJwtSecret(hash);

      expect(jwtSecret).toBe(`${JWT_SECRET}${hash}`);
    });
  });

  describe('generateSignedJWT()', () => {
    it('should return a signed JWT', () => {
      const userId = uuidv4();
      const payload = {
        username: 'john@doe.com',
        role: UserRoleEnum.Seller,
      };

      const token = generateSignedJWT(userId, hash, payload);

      const decodedToken = jwt.decode(token, { json: true }) as { [key: string]: any };

      expect(decodedToken).toStrictEqual({
        iat: expect.any(Number),
        iss: PUBLIC_HOST,
        jti: expect.any(String),
        username: payload.username,
        role: UserRoleEnum.Seller,
        sub: userId,
      });
    });
  });
});
