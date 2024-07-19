import { EMAIL_SENDER, JWT } from '../../utils';
import { UserSchema, UserVerificationSchema } from '../../models/';
import { NextFunction, Request, Response } from 'express';
import errorHandler from '../../errors';

export const REGISTER_USER = async (req: Request, res: Response, next: NextFunction) => {
  let { password } = await req.body;
  if (!password) return next(res.error.BadRequest('Please enter a password'));
  if (password.length > 5) {
    const hashedPassword = await JWT.HASHED_PASSWORD(password);

    try {
      const User = new UserSchema({ ...req.body, password: hashedPassword });
      const newUser = await User.save();
      const token = await JWT.SIGN_ACCESS_TOKEN({ id: newUser.id, status: newUser.status });
      return res.success(
        { username: newUser.username, token, status: newUser.status },
        'user registered successfully',
      );
    } catch (err) {
      return next(res.createError(400, 'Error registering user', errorHandler(err)));
    }
  } else return next(res.error.BadRequest('Password must be of minimum 6 characters long!'));
};

export const LOGIN_USER = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = await req.body;
  const currentUser = await UserSchema.findOne({ email });
  try {
    if (currentUser) {
      const passwordIsCorrect = await JWT.COMPARE_PASSWORD(password, currentUser.password);

      if (passwordIsCorrect) {
        const { id, username, status } = currentUser;
        const token = await JWT.SIGN_ACCESS_TOKEN({ id, status });
        return res.success({ token, username, status }, 'user successfully signed in');
      } else return next(res.error.BadRequest('email or password not correct!'));
    } else return next(res.error.BadRequest('email or password not correct!'));
  } catch (error) {
    // console.log(errorHandler(error));
  }
};

// const SEND_USER_OTP = async (req: Request, res: Response) => {
//   try {
//     const user = await UserSchema.findById(req.user.id);
//     if (user) {
//       const fullname = user.firstname + ' ' + user.lastname;
//       const email_is_sent = await SEND_USER_VERIFICATION_EMAIL(user._id, user.email, fullname);
//       if (email_is_sent)
//         return res
//           .status(201)
//           .json(
//             SUCCESS_RESPONSE(
//               { message: 'Email sent successfully' },
//               201,
//               'verification code sent successfully',
//             ),
//           );
//       else throw new Error('Unable to send e-mail');
//     } else throw new Error('Unable to complete request');
//   } catch (error) {
//     res.status(500).json(errorHandler(error, 500, 'Internal server error'));
//   }
// };

export const FORGOT_USER_PASSWORD = async (req: Request, res: Response, next: NextFunction) => {
  /* #swagger.summary = "generates verification code for user forgot password on sign in" */
  try {
    const { email } = req.body;
    const user = await UserSchema.findOne({ email });
    if (user) {
      const fullname = user.firstname + ' ' + user.lastname;
      const email_is_sent = await EMAIL_SENDER.SEND_USER_VERIFICATION_EMAIL(
        user._id as string,
        user.email,
        fullname,
      );

      if (email_is_sent) return res.success(null, 'verification code sent successfully');
      else throw new Error('Unable to send e-mail');
    } else return next(res.createError(404, 'No user with the email found'));
  } catch (error: any) {
    next(res.createError(500, 'Internal Server Error', errorHandler(error)));
  }
};

export const RESET_USER_PASSWORD = async (req: Request, res: Response, next: NextFunction) => {
  /* #swagger.summary = "reset user password, for forgotten password, updates user password and user is to login with new password" */
  const { password, email } = req.body;

  try {
    if (!password) throw new Error('Please enter your password');
    if (password.length < 6) throw new Error('Password must be at least 6 characters');

    const user = await UserSchema.findOne({ email });

    if (user) {
      const user_received_email = await UserVerificationSchema.findOne({
        userId: user._id,
      });

      if (user_received_email) {
        const verification_code_matched =
          user_received_email.verification_code === req.body.verification_code;
        if (!verification_code_matched) throw new Error('Incorrect or Expired verification code');
        else {
          const hashedPassword = await JWT.HASHED_PASSWORD(req.body.password);
          const User = await UserSchema.findByIdAndUpdate(
            user._id,
            { password: hashedPassword },
            { new: true, select: '-password' },
          );
          await UserVerificationSchema.findOneAndDelete({
            userId: user._id,
          });
          return res.success(User, 'password reset successfully');
        }
      } else next(res.error.Unauthorized('verification code timeout'));
    } else throw new Error('email not recognized, please enter your correct email');
  } catch (error) {
    return next(res.createError(500, 'user verification failed!', errorHandler(error)));
  }
};

export const GENERATE_USER_OTP = async (req: Request, res: Response) => {
  /* #swagger.summary = "Logout already signed in user, in test phase" */
};

const LOGOUT_USER = async (req: Request, res: Response) => {
  /* #swagger.summary = "Logout already signed in user, in test phase" */
};

const VERIFY_USER_EMAIL = async (req: Request, res: Response) => {
  /* #swagger.summary = "verify user email set is_verified_email to true" */
  try {
    const user_received_email = await UserVerificationSchema.findOne({
      userId: req.user.id,
    });

    if (user_received_email) {
      const verification_code_matched = user_received_email.verification_code === req.body.verification_code;
      if (!verification_code_matched) throw new Error('Incorrect  or Expired verification code');
      else {
        await UserSchema.findByIdAndUpdate(req.user.id, { is_verified_email: true }, { new: true });
        await UserVerificationSchema.findOneAndDelete({
          userId: req.user.id,
        });
        return res.success({}, 'successfully verified user');
      }
    } else throw new Error("You haven't requested a verification code");
  } catch (error) {
    return res.createError(500, 'user verification failed!', errorHandler(error));
  }
};
