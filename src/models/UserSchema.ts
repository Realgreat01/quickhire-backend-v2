import { Schema, model } from 'mongoose';
import { isEmail, isMobilePhone } from 'validator';
import { UserInterface } from '../types';

import { BasicDetailSchema, NotificationSchema } from './schemas/basic-details';
import { ProjectSchema } from './schemas/projects';
import { SkillSchema } from './schemas/skills';
import { ExperienceSchema } from './schemas/experience';
import { EducationSchema } from './schemas/education';
import { BlogSchema } from './schemas/blog-contents.js';
import isURL from 'validator/lib/isURL';

const UserSchema = new Schema<UserInterface>({
  email: {
    type: String,
    minLength: [5, 'email is too short'],
    required: [true, 'email is required'],
    lowercase: true,
    unique: true,
    validate: [isEmail, 'please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: [5, 'password must be of minimum 6 characters long !'],
  },
  username: {
    type: String,
    lowercase: true,
    minLength: [5, 'username must be of minimum 6 characters long'],
    required: [true, 'username is required'],
    unique: true,
  },
  status: {
    type: String,
    default: 'user',
  },
  profile_picture: {
    type: String,
    default: 'https://res.cloudinary.com/dirmjuvyr/image/upload/v1676036688/sx0jqtw1cov1geu5s8kn.png',
  },
  firstname: {
    type: String,
    minLength: [2, 'firstname is too short'],
    required: [true, 'firstname is required'],
  },
  lastname: {
    type: String,
    minLength: [2, 'lastname is too short'],
    required: [true, 'lastname is required'],
  },
  middlename: {
    type: String,
    minLength: [2, 'middlename is too short'],
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'others'],
    default: 'male',
    lowercase: true,
  },
  phone_number: { type: String, validate: [isMobilePhone, 'enter a valid phone number'] },
  about_me: {
    type: String,
    minLength: [100, 'about should be a minimum of 100 characters'],
    maxLength: [800, 'about should be a maximum of 800 characters'],
  },
  header_bio: {
    type: String,
    default: 'Software Developer',
    minLength: [10, 'header should be a minimum of 10 characters'],
    maxLength: [60, 'header should be a maximum of 60 characters'],
  },
  summary: {
    type: String,
    default: 'A very versatile software developer',
    minLength: [24, 'summary should be a minimum of 24 characters'],
    maxLength: [120, 'summary should be a maximum of 120 characters'],
  },
  cover_letter: String,
  hobbies: [String],
  interests: [String],
  address: {
    type: {
      country: {
        type: String,
        required: [true, 'country is required'],
        default: 'Nigeria',
      },
      alpha_code: String,
      state: String,
      area: String,
      city: String,
      street: String,
      postal_code: String || Number,
      zip_code: String || Number,
    },
    default: { country: 'Nigeria' },
  },
  reference: [
    {
      email: {
        type: String,
        validate: [isEmail, 'Please enter a valid email'],
        required: [true, 'Referee email is required'],
      },

      fullname: {
        type: String,
        required: [true, 'Referee fullname is required'],
      },
      title: {
        type: String,
        enum: ['Mr', 'Mrs', 'Master', 'Miss'],
        default: 'Mr',
      },
      relationship_with_referee: {
        type: String,
        default: '',
      },
      phone_number: {
        type: String,
        validate: [isMobilePhone, 'Please enter a valid phone number'],
      },
    },
  ],
  social_media: {
    github: {
      type: String,
      validate: [isURL, 'Enter a valid URL'],
    },
    twitter: {
      type: String,
      validate: [isURL, 'Enter a valid URL'],
    },
    instagram: {
      type: String,
      validate: [isURL, 'Enter a valid URL'],
    },
    linkedin: {
      type: String,
      validate: [isURL, 'Enter a valid URL'],
    },
    twitch: {
      type: String,
      validate: [isURL, 'Enter a valid URL'],
    },
    hashnode: {
      type: String,
      validate: [isURL, 'Enter a valid URL'],
    },
    youtube: {
      type: String,
      validate: [isURL, 'Enter a valid URL'],
    },
  },
  experience_level: {
    type: String,
    enum: ['entry', 'mid', 'senior'],
    required: true,
    default: 'mid',
  },
  rate: Number,
  highest_education_level: {
    type: String,
    enum: [
      'Bachelors',
      'Masters',
      'Doctorate',
      'Elementary',
      'Diploma',
      'High School',
      'Certificate',
      'Associate Degree',
      'Professional Training',
    ],
    default: 'Bachelors',
    required: true,
  },
  interest_job: {
    type: String,
    lowercase: true,
    enum: ['remote', 'onsite', 'hybrid'],
    default: 'remote',
  },
  availability: { type: String, default: '1 week' },
  notifications: [NotificationSchema],
  projects: [ProjectSchema],
  experience: [ExperienceSchema],
  skills: SkillSchema,
  education: [EducationSchema],
});

const UserModel = model('users', UserSchema);
export { UserModel };
