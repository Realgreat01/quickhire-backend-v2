import { UserSchema } from '../../models';
import errorHandler from '../../errors';
import { NextFunction, Request, Response } from 'express';

// BASIC DETAILS
export const GET_USER_DETAILS = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;
  const currentUser = await UserSchema.findById(id).select('-password');
  if (currentUser) {
    return res.success(currentUser);
  } else next(res.error.NotFound('user not found'));
};

//
export const GET_SINGLE_USER = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const user = await UserSchema.findOne({ username: id }).select('-password');
  if (user) {
    return res.success(user);
  } else next(res.error.NotFound('user not found'));
};

// SUBMIT BASIC DETAILS
export const UPDATE_USER_DETAILS = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;
  const { email, password, status, skills, education, projects, experience, ...updateData } = req.body;
  const currentUser = await UserSchema.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select('-password');
  if (currentUser) {
    return res.success(currentUser, 201);
  } else next(res.error.NotFound('user not found'));
};
