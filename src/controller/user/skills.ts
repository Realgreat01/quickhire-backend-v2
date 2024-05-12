import { UserSchema } from '../../models';
import { NextFunction, Request, Response } from 'express';
import errorHandler from '../../errors';

export const GET_USER_SKILLS = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;
  const currentUser = await UserSchema.findById(id);
  if (currentUser) return res.success(currentUser.skills);
  else next(res.error.NotFound('user not found djs'));
};

export const UPDATE_USER_SKILLS = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;
  const currentUser = await UserSchema.findById(id);
  if (currentUser) {
    try {
      currentUser.skills = { ...currentUser.skills, ...req.body };
      const data = await currentUser.save();
      return res.success(data.skills);
    } catch (error) {
      next(res.createError(400, '', errorHandler(error)));
    }
  } else next(res.error.NotFound('user not found keh ahahHh'));
};
