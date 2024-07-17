import { UserSchema, JobSchema, CompanySchema, EmailListSchema } from '../../models';
import { NextFunction, Request, Response } from 'express';
import errorHandler from '../../errors';
import { API_SERVICE } from '../../utils';
import { GET_ALL_COUNTRIES, GET_CITIES_BY_STATE_AND_COUNTRY, GET_STATES_BY_COUNTRY } from '../../services';

export const CONVERT_IMAGE_BASE64_URL = async (req: Request, res: Response, next: NextFunction) => {
  const image = req.body.image_url;
  try {
    const base64 = await API_SERVICE.IMAGE_TO_BASE64(image);
    return res.success(base64);
  } catch (error) {
    next(res.createError(500, 'Error converting file', error));
  }
};

export const SUBSCRIBE_TO_EMAIL = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscribedUser = await EmailListSchema.create(req.body);
    return res.success(subscribedUser, 'subscription successful', 201);
  } catch (error) {
    return next(res.createError(400, '', errorHandler(error)));
  }
};

export const GET_EMAIL_SUBSCRIBERS = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscribers = await EmailListSchema.find();
    const emailList = subscribers.map(({ email, firstname, lastname }) => {
      return { email, firstname, lastname };
    });
    return res.success(emailList, 'subscribers retrieved successfully');
  } catch (error) {
    return next(res.createError(400, '', errorHandler(error)));
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

export const GET_COUNTRIES = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const countries = await GET_ALL_COUNTRIES();
    return res.success(countries.data);
  } catch (error) {
    next(res.error.InternalServerError('Unable to get countries'));
  }
};

export const GET_STATES = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const country = req.params.countryId;
    const states = await GET_STATES_BY_COUNTRY(country);
    return res.success(states.data);
  } catch (error) {
    next(res.error.InternalServerError('Unable to get states'));
  }
};

export const GET_CITIES = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const countryId = req.params.countryId;
    const stateId = req.params.stateId;
    const cities = await GET_CITIES_BY_STATE_AND_COUNTRY(countryId, stateId);
    return res.success(cities.data);
  } catch (error) {
    next(res.error.InternalServerError('Unable to get cities'));
  }
};
