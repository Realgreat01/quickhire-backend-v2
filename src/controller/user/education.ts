import { NextFunction, Request, Response } from 'express';
import { UserSchema } from '../../models/';
import errorHandler from '../../errors';

export const GET_EDUCATION = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;

  try {
    const currentUser = await UserSchema.findById(id);
    if (currentUser) {
      return res.success(currentUser.education);
    } else next(res.error.NotFound('user not found'));
  } catch (error) {
    // next(res.error.NotFound('User not found'));
  }
};

export const GET_SINGLE_EDUCATION = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userID = req.user.id;
  try {
    const user = await UserSchema.findOne({ _id: userID }, { education: { $elemMatch: { _id: id } } });
    if (user && user.education.length > 0) {
      return res.status(200).json(user.education[0]);
    } else {
      next(res.error.NotFound('education not found'));
    }
  } catch (error) {
    next(res.error.NotFound('user not found'));
  }
};

export const ADD_EDUCATION = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;
  const currentUser = await UserSchema.findById(id);
  if (currentUser) {
    try {
      currentUser.education.push(req.body);
      const user = await currentUser.save();
      res.success(user.education, 'education added successfully');
    } catch (error) {
      next(res.createError(400, '', errorHandler(error)));
    }
  } else res.error.NotFound('user not found');
};

export const UPDATE_EDUCATION = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userID = req.user.id;
  const currentUser = await UserSchema.findById(userID);

  if (currentUser) {
    try {
      const index = currentUser.education.findIndex((education) => education.id === id);
      if (index >= 0) {
        currentUser.education[index] = { ...req.body, _id: id };
        const user = await currentUser.save();
        return res.success(user.education, 'update successful');
      } else return next(res.error.NotFound('selected education has been previously modified'));
    } catch (error) {
      return next(res.createError(400, '', errorHandler(error)));
    }
  } else next(res.error.NotFound('user not found'));
};

export const DELETE_EDUCATION = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userID = req.user.id;
  try {
    const user = await UserSchema.findByIdAndUpdate(
      userID,
      { $pull: { education: { _id: id } } },
      { new: true },
    );
    if (user) return res.success(user?.education);
    else next(res.error.NotFound());
  } catch (error) {
    next(res.createError(400, '', errorHandler(error)));
  }
};
