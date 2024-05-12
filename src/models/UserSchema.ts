import { Schema, model } from 'mongoose';
import { isEmail, isMobilePhone, isURL } from 'validator';
import { UserInterface } from '../types';

import { BasicDetailSchema, NotificationSchema } from './schemas/basic-details';
import { ProjectSchema } from './schemas/projects';
import { SkillSchema } from './schemas/skills';
import { ExperienceSchema } from './schemas/experience';
import { EducationSchema } from './schemas/education';
import { BlogSchema } from './schemas/blog-contents.js';

const UserSchema = new Schema<UserInterface>(
  {
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
      validate: {
        validator: (value: string) => /^[a-zA-Z0-9_]+$/.test(value),
        message: 'username must contain only letters, numbers, and underscores',
      },
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
      validate: {
        validator: (value: string) => /^[a-zA-Z]+$/.test(value),
        message: 'firstname must contain only letters',
      },
    },
    lastname: {
      type: String,
      minLength: [2, 'lastname is too short'],
      required: [true, 'lastname is required'],
      validate: {
        validator: (value: string) => /^[a-zA-Z]+$/.test(value),
        message: 'lastname must contain only letters',
      },
    },
    middlename: {
      type: String,
      minLength: [2, 'middlename is too short'],
      validate: {
        validator: (value: string) => /^[a-zA-Z]+$/.test(value),
        message: 'middlename must contain only letters',
      },
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
      maxLength: [1200, 'about should be a maximum of 1200 characters'],
    },
    header_bio: {
      type: String,
      default: 'Software Developer | Technical Writer | Builder of the Universe 🌟🎉',
      minLength: [10, 'header should be a minimum of 10 characters'],
      maxLength: [100, 'header should be a maximum of 100 characters'],
    },
    summary: {
      type: String,
      minLength: [50, 'summary should be a minimum of 24 characters'],
      maxLength: [300, 'summary should be a maximum of 300 characters'],
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
      facebook: {
        type: String,
        validate: [isURL, 'Enter a valid URL'],
      },
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
    rate: { type: Number, default: 10 },
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
    job_interest: {
      type: String,
      lowercase: true,
      enum: ['remote', 'onsite', 'hybrid'],
      default: 'remote',
    },
    availability: { type: String, default: '1 week' },
    settings: {
      allow_notifications: { type: Boolean, default: true },
      portfolio_type: { type: String, enum: ['default'], default: 'default' },
      cv_template: { type: String, enum: ['default'], default: 'default' },
      show_summary: { type: Boolean, default: true },
      show_education: { type: Boolean, default: true },
      send_cover_letter: { type: Boolean, default: true },
    },
    notifications: [NotificationSchema],
    projects: [ProjectSchema],
    experience: [ExperienceSchema],
    skills: SkillSchema,
    education: [EducationSchema],
  },
  { timestamps: true },
);

const UserModel = model('users', UserSchema);
export { UserModel };
