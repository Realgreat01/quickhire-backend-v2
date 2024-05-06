import { NextFunction, Request, Response } from 'express';
import { UserSchema } from '../../models/';
import errorHandler from '../../errors';

export const GET_PROJECT = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;
  const currentUser = await UserSchema.findById(id);
  if (currentUser) {
    return res.success(currentUser.projects);
  } else next(res.error.NotFound('user not found'));
};

export const GET_SINGLE_PROJECT = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userID = req.user.id;
  try {
    const user = await UserSchema.findOne({ _id: userID }, { projects: { $elemMatch: { _id: id } } });
    if (user && user.projects.length > 0) {
      return res.status(200).json(user.projects[0]);
    } else {
      next(res.error.NotFound('projects not found'));
    }
  } catch (error) {
    next(res.error.NotFound('user not found'));
  }
};

export const ADD_PROJECT = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;
  const currentUser = await UserSchema.findById(id);
  if (currentUser) {
    try {
      currentUser.projects.push(req.body);
      const user = await currentUser.save();
      res.success(user.projects, 'projects added successfully');
    } catch (error) {
      next(res.createError(400, '', errorHandler(error)));
    }
  } else res.error.NotFound('user not found');
};

export const UPDATE_PROJECT = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userID = req.user.id;
  const currentUser = await UserSchema.findById(userID);

  if (currentUser) {
    try {
      const index = currentUser.projects.findIndex((projects) => projects.id === id);
      if (index >= 0) {
        currentUser.projects[index] = { ...req.body, _id: id };
        const user = await currentUser.save();
        return res.success(user.projects, 'update successful');
      } else return next(res.error.NotFound('selected projects has been previously modified'));
    } catch (error) {
      return next(res.createError(400, '', errorHandler(error)));
    }
  } else next(res.error.NotFound('user not found'));
};

export const DELETE_PROJECT = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userID = req.user.id;
  try {
    const user = await UserSchema.findByIdAndUpdate(
      userID,
      { $pull: { projects: { _id: id } } },
      { new: true },
    );
    if (user) return res.success(user?.projects);
    else next(res.error.NotFound());
  } catch (error) {
    next(res.createError(400, '', errorHandler(error)));
  }
};
