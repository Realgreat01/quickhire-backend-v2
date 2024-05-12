import { CompanySchema } from '../../models';
import errorHandler from '../../errors';
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
