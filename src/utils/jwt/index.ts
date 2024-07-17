import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config();

import { User } from '../../types';

const SIGN_ACCESS_TOKEN = async (data: object) => {
  if (process.env.JWT_ACCESS_TOKEN) return jwt.sign(data, process.env.JWT_ACCESS_TOKEN, { expiresIn: '60d' });
  else throw new Error('Internal server error');
};

const VERIFY_ACCESS_TOKEN = (token: string) => {
  if (process.env.JWT_ACCESS_TOKEN) {
    return jwt.verify(token, process.env.JWT_ACCESS_TOKEN) as User;
  } else throw new Error('Internal server error');
};
const SIGN_REFRESH_TOKEN = async (data: object) => {
  if (process.env.JWT_REFRESH_TOKEN)
    return jwt.sign(data, process.env.JWT_REFRESH_TOKEN, { expiresIn: '90d' });
  else throw new Error('Internal server error');
};
const VERIFY_REFRESH_TOKEN = (token: string) => {
  if (process.env.JWT_REFRESH_TOKEN) {
    return jwt.verify(token, process.env.JWT_REFRESH_TOKEN) as User;
  } else throw new Error('Internal server error');
};

const GENERATE_PAIR_TOKENS = async (refreshToken: string) => {
  try {
    const data = VERIFY_REFRESH_TOKEN(refreshToken);
    const access_token = await SIGN_ACCESS_TOKEN(data);
    const refresh_token = await SIGN_REFRESH_TOKEN(data);
    return { access_token, refresh_token };
  } catch (error) {}
};

const HASHED_PASSWORD = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const COMPARE_PASSWORD = async (user_password: string, encrypted_Password: string) => {
  return await bcrypt.compare(user_password, encrypted_Password);
};

export const JWT = {
  VERIFY_ACCESS_TOKEN,
  SIGN_ACCESS_TOKEN,
  SIGN_REFRESH_TOKEN,
  VERIFY_REFRESH_TOKEN,
  GENERATE_PAIR_TOKENS,
  HASHED_PASSWORD,
  COMPARE_PASSWORD,
};
