import { UserSchema } from '../../models/';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import errorHandler from '../../errors';

export const REGISTER_USER = async (req: Request, res: Response, next: NextFunction) => {
  let { password } = await req.body;
  if (!password) return next(res.error.BadRequest('Please enter a password'));
  if (password.length > 5) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      if (process.env.ACCESS_TOKEN) {
        const User = new UserSchema({ ...req.body, password: hashedPassword });
        const newUser = await User.save();
        const token = jwt.sign({ id: newUser.id, status: newUser.status }, process.env.ACCESS_TOKEN);
        return res.success(
          { username: newUser.username, token, status: newUser.status },
          'user registered successfully',
        );
      } else return next(res.error.BadGateway());
    } catch (err) {
      console.log(errorHandler(err));
      return next(res.createError(400, 'Error registering user', errorHandler(err)));
    }
  } else return next(res.error.BadRequest('Password must be of minimum 6 characters long!'));
};

export const LOGIN_USER = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = await req.body;
  const currentUser = await UserSchema.findOne({ email });
  if (currentUser) {
    const passwordIsCorrect = await bcrypt.compare(password, currentUser.password);
    if (passwordIsCorrect && process.env.ACCESS_TOKEN) {
      const { id, username, status } = currentUser;
      const token = jwt.sign({ id, status }, process.env.ACCESS_TOKEN);
      return res.success({ token, username, status }, 'user successfully signed in');
    } else return next(res.error.BadRequest('email or password not correct!'));
  } else return next(res.error.BadRequest('email or password not correct!'));
};

const changeUserPassword = async (req, res, next) => {};

const logoutUser = async (req, res, next) => {
  req.user = null;
  next();
};

const forgotUserPassword = async (req, res, next) => {};
