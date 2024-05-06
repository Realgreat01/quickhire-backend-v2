import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { isEmail } from 'validator';
import bcrypt from 'bcrypt';
require('dotenv').config();

import errorHandler from '../../errors';
import { CompanySchema } from '../../models/';
import { IncrementSchema } from '../../models/';
import { COMPARE_PASSWORD, HASHED_PASSWORD, SIGN_TOKEN } from '../../config';

export const REGISTER_COMPANY = async (req: Request, res: Response, next: NextFunction) => {
  let password = req.body.password;
  if (!password) password = '';
  if (password.length > 5) {
    const hashedPassword = await HASHED_PASSWORD(password);
    const count = (await IncrementSchema.find()).length;

    // Generating Unique ID
    const STANDARD_COUNT = 1000;
    const UniqueID = STANDARD_COUNT + count;

    // Adding New Company to Database
    const Company = new CompanySchema({
      ...req.body,
      password: hashedPassword,
      company_id: 'qhr' + UniqueID,
    });

    // Performing Data Manipulations and Authentication
    try {
      const createdCompany = await Company.save();
      const new_company = createdCompany;
      const token = await SIGN_TOKEN({ id: new_company.id, status: new_company.status });
      const count = (await IncrementSchema.find()).length;
      await IncrementSchema.create({ count });
      const { company_name, company_id, email, status } = new_company;
      return res.success(
        { company_name, company_id, email, status, token },
        'company created successfully',
        201,
      );
    } catch (err) {
      res.status(400).json(errorHandler(err));
    }
  } else next(res.error.BadRequest('Password must be of minimum 6 characters long!'));
};

export const LOGIN_COMPANY = async (req: Request, res: Response, next: NextFunction) => {
  let { password, email_or_company_id } = req.body;

  if (password === undefined) password = '';
  if (email_or_company_id === undefined) email_or_company_id = '';
  let data = {};
  if (isEmail(email_or_company_id)) data = { email: email_or_company_id };
  else data = { company_id: email_or_company_id };

  const company = await CompanySchema.findOne(data);
  if (company) {
    const passwordIsCorrect = await COMPARE_PASSWORD(password, company.password);
    if (passwordIsCorrect) {
      const { id, status } = company;
      const token = await SIGN_TOKEN({ id, status });
      return res.success({ token, company_id: company.company_id });
    } else next(res.error.NotFound('invalid nn credentials!'));
  } else next(res.error.NotFound('invalid credentials!'));
};

const changeCompanyPassword = async (req: Request, res: Response, next: NextFunction) => {};

const logoutCompany = async (req: Request, res: Response, next: NextFunction) => {
  next();
};
const forgotCompanyPassword = async (req: Request, res: Response, next: NextFunction) => {};
