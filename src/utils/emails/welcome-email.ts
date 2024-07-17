import * as dotenv from 'dotenv';
import { SendMailOptions } from 'nodemailer';
import { MAIL_SENDER } from './email-config';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';

dotenv.config();

const SEND_USER_WELCOME_EMAIL = async (email: string, fullname: string) => {
  try {
    const source = fs.readFileSync(path.join(__dirname, '../../../views/templates', 'welcome.ejs'), 'utf-8');
    const context = { fullname, date: new Date().getFullYear() };
    const html = ejs.render(source, context);

    const mailOptions = {
      from: 'QuickHire Jobs<admin@quickhire.site>',
      to: email,
      subject: 'Welcome To QuickHire',
      html: html,
    };
    const transporter = await MAIL_SENDER(mailOptions);

    return true;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

export { SEND_USER_WELCOME_EMAIL };

// SEND_USER_WELCOME_EMAIL('samsonrealgreat@gmail.com', 'Samson Ikuomenisan');
