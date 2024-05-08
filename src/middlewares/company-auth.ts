import { NextFunction, Request, Response } from 'express';

export const IS_COMPANY = (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.user;
  if (status === 'company') return next();
  else return next(res.error.Forbidden());
};
