import { CompanySchema } from '../../models';
import errorHandler from '../../errors';
import CloudinaryConfig from '../../config/cloudinary';
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

  const options = {
    overwrite: false,
    unique_filename: true,
    folder: 'quickhire-company-logo',
  };

  const { id } = req.user;
  try {
    let cloudinaryUploadStream = CloudinaryConfig.uploader.upload_stream(options, async (error, data) => {
      if (error) {
        console.log(error);
        return next(res.error.BadRequest(error));
      } else {
        await CompanySchema.findByIdAndUpdate(id, { logo: data.url });
        return res.success({ logo: data.url }, 'Logo updated successfully !');
      }
    });
    if (req.file) streamifier.createReadStream(req.file.buffer).pipe(cloudinaryUploadStream);
  } catch (error) {
    next(res.createError(500, '', errorHandler(error)));
  }
};
export const UPLOAD_COMPANY_COVER_IMAGE = async (req: Request, res: Response, next: NextFunction) => {
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
    folder: 'quickhire-company-covers',
  };

  const { id } = req.user;
  try {
    let cloudinaryUploadStream = CloudinaryConfig.uploader.upload_stream(options, async (error, data) => {
      if (error) next(res.error.BadRequest('unable to cover image'));
      else {
        await CompanySchema.findByIdAndUpdate(id, { cover_image: data.url });
        return res.success({ cover_image: data.url }, 'coverimage updated successfully !');
      }
    });
    if (req.file) streamifier.createReadStream(req.file.buffer).pipe(cloudinaryUploadStream);
  } catch (error) {
    next(res.createError(500, '', errorHandler(error)));
  }
};
