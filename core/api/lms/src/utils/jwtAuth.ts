import jwt from 'jsonwebtoken';
import User from '../types/User';

export default (user: User): string => {
  const secret: string = process.env.JWT_SECRET ?? 'examplesecret';
  return jwt.sign(user, secret, {
    expiresIn: '1h'
  });
};
