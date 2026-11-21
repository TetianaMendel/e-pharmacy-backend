import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw createHttpError(401, 'Missing authorization header');
  }

  const [bearer, token, extra] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token || extra) {
    throw createHttpError(401, 'Invalid authorization header');
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw createHttpError(401, 'Invalid or expired token');
  }

  if (typeof payload.sub !== 'string') {
    throw createHttpError(401, 'Invalid token payload');
  }

  const user = await User.findById(payload.sub);

  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  req.user = user;

  next();
};
