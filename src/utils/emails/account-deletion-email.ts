import { SendMailOptions } from 'nodemailer';
import { MAIL_SENDER } from './email-config';
import * as dotenv from 'dotenv';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';

dotenv.config();

const SEND_USER_ACCOUNT_DELETION_EMAIL = async (email: string, fullname: string) => {
  try {
    const source = fs.readFileSync(
      path.join(__dirname, '../../../views/templates', 'account-deletion.ejs'),
      'utf-8',
    );
    const context = { fullname, date: new Date().getFullYear() };
    const html = ejs.render(source, context);

    const mailOptions = {
      from: 'QuickHire Jobs <admin@quickhire.site>',
      to: email,
      subject: 'Account Deletion Notice',
      html: html,
    };
    await MAIL_SENDER(mailOptions);

    return true;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

export { SEND_USER_ACCOUNT_DELETION_EMAIL };
