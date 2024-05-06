import { Request, Response, NextFunction } from 'express';
import { VERIFY_TOKEN } from '../config';
import * as dotenv from 'dotenv';

import errorHandler from '../errors';
import { UserSchema } from '../models';

dotenv.config();

const AUTHENTICATE_USER = async (req: Request, res: Response, next: NextFunction) => {
  /* #swagger.autoHeaders=false */
  /* #swagger.security = [{ "bearerAuth": [] }] */

  const { authorization } = req.headers;
  if (authorization && process.env.ACCESS_TOKEN) {
    if (authorization.startsWith('Bearer')) {
      const token = authorization.split(' ')[1];
      try {
        req.user = VERIFY_TOKEN(token);
        return next();
      } catch (error) {
        return next(res.createError(400, 'message', { user: 'Invalid Token' }));
        // return next(res.createError.Unauthorized('Invalid Token'));
      }
    }
  } else return next(res.error.Unauthorized('Access Denied - User not authenticated'));
};

const VERIFY_USER_DETAILS = async (req: Request, res: Response, next: NextFunction) => {
  /* #swagger.summary = "verify a user detail , no logic for now" */
  try {
    const user = await UserSchema.findOne({
      _id: req.user.id,
      is_email_verified: { $ne: true },
    });
    if (user) return next();
    else return res.error.BadRequest('user is already verified');
  } catch (error) {
    return res.createError(400, 'message', error);
  }
};

const SUPER_ADMIN = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserSchema.findOne({
      _id: req.user.id,
      role: 'super_admin',
    });
    if (user) return next();
    else throw new Error('You are not Authorized for this request');
  } catch (error) {
    return res.status(403).json(errorHandler(error));
  }
};

export { AUTHENTICATE_USER, VERIFY_USER_DETAILS, SUPER_ADMIN };
