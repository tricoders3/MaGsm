import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/token.js';

export const registerUser = async ({ name, email, password }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new Error('Email already exists');

  const hashedPassword = await bcrypt.hash(password, 12);

  return User.create({
    name,
    email,
    password: hashedPassword,
  });
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new Error('Invalid credentials');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid credentials');

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};
