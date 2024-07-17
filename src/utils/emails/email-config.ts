import formData from 'form-data';
import Mailgun from 'mailgun.js';
import * as dotenv from 'dotenv';

dotenv.config();

const mailgun = new Mailgun(formData);

export const MAIL_SENDER = async (options: any) => {
  try {
    mailgun
      .client({
        username: 'api',
        key: process.env.MAILGUN_API_KEY || '7ca2c5ada565cc67c6ab470fca205fb0-324e0bb2-688072e0',
      })
      .messages.create('home4im.com', options);
  } catch (error) {
    throw error;
  }
};
