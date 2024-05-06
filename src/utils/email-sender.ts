// import { VerificationSchema } from '../models/';
// import nodemailer, { SendMailOptions } from 'nodemailer';
// import * as dotenv from 'dotenv';
// import ejs from 'ejs';
// import fs from 'fs';
// import path from 'path';
// import { GENERATE_OTP } from '../config';
// import { Types } from 'mongoose';

// dotenv.config();

// const SEND_USER_VERIFICATION_EMAIL = async (
//   userId: Types.ObjectId | string,
//   email: string,
//   fullname: string,
//   file_name?: 'welcome.ejs',
//   title?: 'Welcome To Home',
// ) => {
//   try {
//     const verification_code = GENERATE_OTP();
//     const source = fs.readFileSync(
//       path.join(__dirname, '../../views/templates', file_name || 'verification.ejs'),
//       'utf-8',
//     );
//     const context = { userId, fullname, verification_code };
//     const html = ejs.render(source, context);

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.GMAIL_USERNAME || '',
//         pass: process.env.GMAIL_PASSWORD || '',
//       },
//     });

//     const mailOptions: SendMailOptions = {
//       from: {
//         name: 'Home App',
//         address: process.env.GMAIL_USERNAME || '',
//       },
//       to: email,
//       subject: title || 'HOME USER VERIFICATION',
//       html: html,
//     };

//     await transporter.sendMail(mailOptions);
//     await VerificationSchema.create({ userId, verification_code });
//     return true;
//   } catch (error: any) {
//     if (error.code === 11000) throw new Error('User is undergoing verification');
//     throw new Error('Unable to send email due to internal server error');
//   }
// };

// export { SEND_USER_VERIFICATION_EMAIL };
