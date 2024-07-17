import { UserVerificationSchema } from '../../models';
import { MAIL_SENDER } from './email-config';
import * as dotenv from 'dotenv';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import { UNIQUE_NUMBERS } from '../../utils';
import { Types } from 'mongoose';
dotenv.config();

const SEND_USER_VERIFICATION_EMAIL = async (
  userId: Types.ObjectId | string,
  email: string,
  fullname: string,
) => {
  try {
    const verification_code = UNIQUE_NUMBERS.GENERATE_OTP();
    const source = fs.readFileSync(
      path.join(__dirname, '../../../views/templates', 'verification.ejs'),
      'utf-8',
    );
    const context = { fullname, verification_code, date: new Date().getFullYear() };
    const html = ejs.render(source, context);

    const options = { new: true, upsert: true, setDefaultsOnInsert: true };
    const update = {
      verification_code,
      expire_at: Date.now(),
    };
    await UserVerificationSchema.findOneAndUpdate({ userId }, update, options);

    const mailOptions = {
      from: 'QuickHire Jobs <admin@quickhire.site>',
      to: email,
      subject: 'QuickHire Verifications',
      html: html,
    };
    await MAIL_SENDER(mailOptions);
    return true;
  } catch (error: any) {
    if (error.code === 11000) throw new Error('User is undergoing verification');
    console.log(error);
    throw error;
  }
};

export { SEND_USER_VERIFICATION_EMAIL };
