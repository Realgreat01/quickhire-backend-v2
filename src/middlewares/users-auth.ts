import { NextFunction, Request, Response } from 'express';
export const IS_USER = (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.user;
  if (status === 'user') return next();
  else return res.error.Forbidden();
};
