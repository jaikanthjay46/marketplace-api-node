import { Unauthorized } from 'http-errors';
import { Service } from 'typedi';
import { UserModel } from '../models';

@Service()
export default class AuthService {
  /**
   * Authenticates a user and returns a JWT token.
   */
  async login(username: string, password: string): Promise<string> {
    // Check if a user with this username exists
    const user = await UserModel.findOne({
      attributes: {
        include: ['password'],
      },
      where: { username },
    });

    if (!user) {
      throw new Unauthorized('Invalid credentials.');
    }

    // Check if passwords match
    const passwordMatch = await user.comparePassword(password);

    if (!passwordMatch) {
      throw new Unauthorized('Invalid credentials.');
    }

    // Generate JWT
    const token = await user.generateJWT();

    return token;
  }
}
