import * as dotenv from 'dotenv';
import { SendMailOptions } from 'nodemailer';
import { MAIL_SENDER } from './email-config';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import { JobRecommendationEmailData } from '../../types';

dotenv.config();

export const SEND_JOB_RECOMMENDATIONS_EMAIL = async (EmailData: JobRecommendationEmailData[]) => {
  try {
    const source = fs.readFileSync(
      path.join(__dirname, '../../../views/templates', 'top-matched-jobs.ejs'),
      'utf-8',
    );

    for (const data of EmailData) {
      const html = ejs.render(source, { user: data.user, jobs: data.job });
      const mailOptions = {
        from: 'QuickHire Jobs<admin@quickhire.site>',
        to: data.user.email,
        subject: 'QuickHire - Top Matching Jobs',
        html: html,
      };

      await MAIL_SENDER(mailOptions);
      console.log(`Email sent to ${data.user.name}`);
    }
    return true;

    return true;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
