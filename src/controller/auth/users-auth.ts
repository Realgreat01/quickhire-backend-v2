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

const FORGOT_PASSWORD = async (req: Request, res: Response, next: NextFunction) => {
  /* #swagger.summary = "generates verification code for user forgot password on sign in" */
  try {
    const { email } = req.body;
    const user = await UserSchema.findOne({ email });
    if (user) {
      const fullname = user.firstname + ' ' + user.lastname;
      // const email_is_sent = await SEND_USER_VERIFICATION_EMAIL(user._id, user.email, fullname);
      const email_is_sent = true;
      console.log(email_is_sent);
      if (email_is_sent) return res.success();
      else throw new Error('Unable to send e-mail');
    } else res.error.NotFound('No user with the email ' + email + ' found');
  } catch (error: any) {
    next(res.error.InternalServerError());
  }
};

const logoutUser = async (req, res, next) => {
  req.user = null;
  next();
};

const forgotUserPassword = async (req, res, next) => {};
