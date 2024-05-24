import { UserSchema } from '../../models';
import errorHandler from '../../errors';
import { UPLOAD_TO_CLOUDINARY } from '../../config/cloudinary';

import { NextFunction, Request, Response } from 'express';

// ALL USERS
export const GET_ALL_USERS = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserSchema.find().select('-password');
    return res.success(users);
  } catch (error) {
    next(res.error.NotFound('no user found'));
  }
};

// BASIC DETAILS
export const GET_USER_DETAILS = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user;
    const currentUser = await UserSchema.findById(id).select('-password');

    return res.success(currentUser);
  } catch (error) {
    next(res.error.NotFound('user not found'));
  }
};

//
export const GET_SINGLE_USER = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const user = await UserSchema.findOne({ username: id }).select('-password');
    return res.success(user);
  } catch (error) {
    next(res.error.NotFound('user not found'));
  }
};

// SUBMIT BASIC DETAILS
export const UPDATE_USER_DETAILS = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;
  const { email, password, status, skills, ...updateData } = req.body;
  try {
    const currentUser = await UserSchema.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');
    return res.success(currentUser, 201);
  } catch (error) {
    next(res.createError(400, '', error));
  }
};

export const UPLOAD_PROFILE_PICTURE = async (req: Request, res: Response, next: NextFunction) => {
  //converting buffer to usable format

  /*  #swagger.consumes = ['multipart/form-data']
		#swagger.description = 'uploading user profile picture '
		#swagger.summary = 'Some for user profile picture '
        #swagger.parameters['profile_picture'] = {
		in: 'formData',
		type: 'file',
		required: 'true',
    }
	*/

  const options = {
    overwrite: false,
    unique_filename: true,
    folder: 'quickhire',
  };

  const { id } = req.user;
  try {
    if (req.file) {
      const imageURL = await UPLOAD_TO_CLOUDINARY(req.file);
      await UserSchema.findByIdAndUpdate(id, { profile_picture: imageURL });
      return res.success({ profile_picture: imageURL }, 'Profile picture updated successfully !');
    } else return next(res.error.BadRequest());
  } catch (error) {
    next(res.createError(500, '', errorHandler(error)));
  }
};
