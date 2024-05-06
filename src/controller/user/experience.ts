import { NextFunction, Request, Response } from 'express';
import { UserSchema } from '../../models/';
import errorHandler from '../../errors';

export const GET_EXPERIENCE = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;
  const currentUser = await UserSchema.findById(id);
  if (currentUser) {
    return res.success(currentUser.experience);
  } else next(res.error.NotFound('user not found'));
};

export const GET_SINGLE_EXPERIENCE = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userID = req.user.id;
  try {
    const user = await UserSchema.findOne({ _id: userID }, { experience: { $elemMatch: { _id: id } } });
    if (user && user.experience.length > 0) {
      return res.status(200).json(user.experience[0]);
    } else {
      next(res.error.NotFound('experience not found'));
    }
  } catch (error) {
    next(res.error.NotFound('user not found'));
  }
};

export const ADD_EXPERIENCE = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;
  const currentUser = await UserSchema.findById(id);
  if (currentUser) {
    try {
      currentUser.experience.push(req.body);
      const user = await currentUser.save();
      res.success(user.experience, 'experience added successfully');
    } catch (error) {
      next(res.createError(400, '', errorHandler(error)));
    }
  } else res.error.NotFound('user not found');
};

export const UPDATE_EXPERIENCE = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userID = req.user.id;
  const currentUser = await UserSchema.findById(userID);

  if (currentUser) {
    try {
      const index = currentUser.experience.findIndex((experience) => experience.id === id);
      if (index >= 0) {
        currentUser.experience[index] = { ...req.body, _id: id };
        const user = await currentUser.save();
        return res.success(user.experience, 'update successful');
      } else return next(res.error.NotFound('selected experience has been previously modified'));
    } catch (error) {
      return next(res.createError(400, '', errorHandler(error)));
    }
  } else next(res.error.NotFound('user not found'));
};

export const DELETE_EXPERIENCE = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userID = req.user.id;
  try {
    const user = await UserSchema.findByIdAndUpdate(
      userID,
      { $pull: { experience: { _id: id } } },
      { new: true },
    );
    if (user) return res.success(user?.experience);
    else next(res.error.NotFound());
  } catch (error) {
    next(res.createError(400, '', errorHandler(error)));
  }
};
