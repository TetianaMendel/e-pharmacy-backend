import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  const { username, email, phone, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw createHttpError(400, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    phone,
    password: hashedPassword,
  });

  res.status(201).json(newUser);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(
    password,
    user.password,
  );

  if (!isValidPassword) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const token = jwt.sign(
    { sub: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  );

  res.status(200).json({
    token,
  });
};

export const getUserInfo = async (req, res) => {
  const { username, email } = req.user;

  res.status(200).json({
    username,
    email,
  });
};

export const logoutUser = async (req, res) => {
  res.status(200).json({
    message: 'Logout successful',
  });
};
