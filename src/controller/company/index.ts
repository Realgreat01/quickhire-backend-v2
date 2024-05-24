import { CompanySchema } from '../../models';
import errorHandler from '../../errors';
import { UPLOAD_TO_CLOUDINARY } from '../../config/cloudinary';
import streamifier from 'streamifier';
import { NextFunction, Request, Response } from 'express';

export const GET_ALL_COMPANY = async (req: Request, res: Response, next: NextFunction) => {
  const allCompanies = await CompanySchema.find();
  res.status(200).json(allCompanies);
};

export const GET_CURRENT_COMPANY = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user;
    const Company = await CompanySchema.findById(id).select('-password');
    return res.success(Company);
  } catch (error) {
    next(res.createError(400, '', errorHandler(error)));
  }
};

export const GET_SINGLE_COMPANY = async (req: Request, res: Response, next: NextFunction) => {
  const { company_id } = req.params;
  try {
    const company = await CompanySchema.findOne({ company_id }).select('-password');
    return res.success(company);
  } catch (error) {
    next(res.createError(500, '', errorHandler(error)));
  }
};

export const UPDATE_COMPANY_DETAILS = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;
  const { email, password, status, ...updateData } = req.body;
  try {
    const company = await CompanySchema.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');
    return res.success(company, 201);
  } catch (error) {
    next(res.createError(400, '', errorHandler(error)));
  }
};

export const UPLOAD_COMPANY_LOGO = async (req: Request, res: Response, next: NextFunction) => {
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

  const { id } = req.user;
  try {
    if (req.file) {
      const imageURL = await UPLOAD_TO_CLOUDINARY(req.file);
      await CompanySchema.findByIdAndUpdate(id, { logo: imageURL });
      return res.success({ logo: imageURL }, 'cover image updated successfully !');
    } else return next(res.error.BadRequest());
  } catch (error) {
    next(res.createError(500, '', errorHandler(error)));
  }
};

export const UPLOAD_COMPANY_COVER_IMAGE = async (req: Request, res: Response, next: NextFunction) => {
  //converting buffer to usable format

  /*    #swagger.consumes = ['multipart/form-data']
		    #swagger.description = 'uploading user profile picture '
		    #swagger.summary = 'Some for user profile picture '
        #swagger.parameters['profile_picture'] = {
                  in: 'formData',
                  type: 'file',
                  required: 'true',
         }
	*/

  const { id } = req.user;
  try {
    if (req.file) {
      const imageURL = await UPLOAD_TO_CLOUDINARY(req.file);
      await CompanySchema.findByIdAndUpdate(id, { cover_image: imageURL });
      return res.success({ cover_image: imageURL }, 'cover image updated successfully !');
    } else return next(res.error.BadRequest());
  } catch (error) {
    next(res.createError(500, '', errorHandler(error)));
  }
};
