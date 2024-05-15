import { UserSchema } from '../../models';
import errorHandler from '../../errors';
import CloudinaryConfig from '../../config/cloudinary';
import streamifier from 'streamifier';
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
    let cloudinaryUploadStream = CloudinaryConfig.uploader.upload_stream(options, async (error, data) => {
      if (error) next(res.error.BadRequest('unable to update user profile picture'));
      else {
        await UserSchema.findByIdAndUpdate(id, { profile_picture: data.url });
        return res.success({ profile_picture: data.url }, 'Profile picture updated successfully !');
      }
    });
    if (req.file) streamifier.createReadStream(req.file.buffer).pipe(cloudinaryUploadStream);
  } catch (error) {
    next(res.createError(500, '', errorHandler(error)));
  }
};
