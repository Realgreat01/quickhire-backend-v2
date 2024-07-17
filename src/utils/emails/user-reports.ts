import { SendMailOptions } from 'nodemailer';
import { MAIL_SENDER } from './email-config';
import * as dotenv from 'dotenv';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
// import { UserReport } from '../../interface';
type UserReport = any;
dotenv.config();

const SEND_ACCOUNT_REPORT_NOTICE = async (report: UserReport) => {
  try {
    const source = fs.readFileSync(path.join(__dirname, '../../../views/templates', 'reports.ejs'), 'utf-8');
    const context = {
      reporter: report.reporter,
      reported_user: report.reported_user,
      message: report.message,
      report_id: report.report_id,
      report_type: report.report_type || 'spam',
      date: new Date().getFullYear(),
    };
    const html = ejs.render(source, context);

    const mailOptions = {
      from: 'Home4Im Incorporated <admin@home4im.com>',
      to: 'samsonrealgreat@gmail.com',
      subject: 'Account Report Notice',
      html: html,
    };
    await MAIL_SENDER(mailOptions);

    return true;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

export { SEND_ACCOUNT_REPORT_NOTICE };
