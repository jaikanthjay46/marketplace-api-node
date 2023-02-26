import { randomBytes } from 'crypto';
import { UserModel } from '../../../src/models';
import { agent } from '../../jest.setup';
import { cleanDatabase } from '../../utils';

/**
 * GET /users/:userId
 */
describe('GET /users/:userId', () => {
  let user: UserModel;
  let token: string;

  beforeAll(async () => {
    await cleanDatabase();

    user = await UserModel.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@gmail.com',
      password: 'p4ssW0rd',
    });
    token = await user.generateJWT();
  });

  it('should return 200 and the details of the user', async () => {
    const userId = user.id;

    const res = await agent
      .get(`/users/${userId}`)
      .accept('json')
      .auth(token, { type: 'bearer' })
      .type('json')
      .expect(200);

    expect(res.body).toStrictEqual({
      id: expect.any(String),
      fullName: 'John Doe',
      email: 'john.doe@gmail.com',
      createdAt: expect.any(String),
    });
  });

  it('should return 404 on user not found', async () => {
    const userId = randomBytes(16).toString('hex');

    await agent
      .get(`/users/${userId}`)
      .accept('json')
      .auth(token, { type: 'bearer' })
      .type('json')
      .expect(404);
  });

  it('should return 401 on user not authenticated', async () => {
    const userId = user.id;

    await user.destroy();

    await agent.get(`/users/${userId}`).accept('json').type('json').expect(401);
  });
});
