import { UserSchema, JobSchema, CompanySchema } from '../../models';
import { NextFunction, Request, Response } from 'express';
import errorHandler from '../../errors';
import { IMAGE_TO_BASE64 } from '../../utils';

export const CONVERT_IMAGE_BASE64_URL = async (req: Request, res: Response, next: NextFunction) => {
  const image = req.body.image_url;
  try {
    const base64 = await IMAGE_TO_BASE64(image);
    return res.success(base64);
  } catch (error) {
    next(res.createError(500, 'Error converting file', error));
  }
};

export const OPERATIONAL_INSIGHTS = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserSchema.find();
    const company = await CompanySchema.find();
    const jobs = await JobSchema.find();
    const activeJobs = await JobSchema.find({ job_status: 'open' });
    return res.success({
      users: users.length,
      companies: company.length,
      jobs: jobs.length,
      active_applications: activeJobs.length,
    });
  } catch (error) {}
};
