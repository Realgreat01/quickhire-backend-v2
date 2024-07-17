import { CompanyInterface, TaxInformation } from './company';
import {
  JobInterface,
  JobRecommendationEmailData,
  Salary,
  InterviewFeedback,
  JobDuration,
  Applicant,
} from './job';
import { SocialLinks, Skills } from './utils';
import { UserInterface, BasicDetail, Notification, Education, Experience, Project, UserSkills } from './user';

import type ServerResponse from 'responseformatjson';
import type createHttpError from 'http-errors';
import { Types } from 'mongoose';

export interface User {
  id: Types.ObjectId | string;
  _id?: Types.ObjectId | string;
  username?: string;
  iat?: number;
  verification_code?: number;
  email?: string;
  fullname?: string;
  firstname?: string;
  lastname?: string;
  status?: 'company' | 'user';
}

declare global {
  namespace Express {
    interface Request {
      user: User;
      auth: string;
    }
    interface Response {
      success: ServerResponse;
      error: createHttpError.NamedConstructors;
      createError: (code: number, message: string, data?: any) => any;
    }
  }
}

// // express.d.ts

// import { Response } from 'express';

// declare module 'express-serve-static-core' {
//   export interface Response {
//     ServerResponse;
//   }
// }

declare module 'socket.io' {
  interface Socket {
    user: User;
  }
}

interface Job {
  id: string;
  title: string;
  url: string;
  icon: string;
  company: string;
  location?: string; // using optional because address?.country might not exist
  experienceLevel: string;
  type: string;
  locationType: string;
}

export {
  BasicDetail,
  Notification,
  Education,
  Experience,
  Project,
  UserSkills,
  UserInterface,
  //
  CompanyInterface,
  TaxInformation,

  //
  SocialLinks,
  Skills,

  //
  JobInterface,
  JobRecommendationEmailData,
  Salary,
  Applicant,
  InterviewFeedback,
  JobDuration,
};
