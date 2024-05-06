import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import { User } from '../interface';

const SIGN_TOKEN = async (data: object) => {
  if (process.env.ACCESS_TOKEN) return jwt.sign(data, process.env.ACCESS_TOKEN);
  else throw new Error('Internal server error');
};

const VERIFY_TOKEN = (token: string) => {
  if (process.env.ACCESS_TOKEN) {
    return jwt.verify(token, process.env.ACCESS_TOKEN) as User;
  } else throw new Error('Internal server error');
};

export { VERIFY_TOKEN, SIGN_TOKEN };
