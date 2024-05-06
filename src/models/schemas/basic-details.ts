import { Schema } from 'mongoose';
import { BasicDetail , Notification} from '../../types';
import { isEmail, isMobilePhone, isURL } from 'validator';
export const NotificationSchema = new Schema<Notification>({
  title: { type: String, required: true },
  body: { type: String, required: true },
  _id: { type: Schema.Types.ObjectId, auto: true }, // MongoDB automatically uses this field as a primary key
  created_at: { type: Date, default: Date.now }, // Automatically set to the current date and time when a notification is created
  is_read: { type: Boolean, default: false }, // Defaults to false, indicating that a notification hasn't been read
  notification_type: {
    type: String,
    enum: ['general', 'updates', 'security'],
    required: true,
  },
});

export const BasicDetailSchema = new Schema<BasicDetail>({
  firstname: {
    type: String,
    minLength: [2, 'lastname is too short'],
    required: [true, 'lastname is required'],
  },
  lastname: {
    type: String,
    minLength: [2, 'lastname is too short'],
    required: [true, 'lastname is required'],
  },
  middlename: {
    type: String,
    required: [true, 'middlename is required'],
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'others'],
    default: 'male',
    lowercase: true,
  },
  phone_number: { type: String, validate: [isMobilePhone, 'Enter a valid phone number'] },
  about_me: {
    type: String,
    required: [true, 'Please enter a description of your skills and competence'],
    minLength: [100, 'About should be a minimum of 100 characters'],
    maxLength: [800, 'About should be a maximum of 800 characters'],
  },
  header_bio: {
    type: String,
    default: 'Software Developer',
    required: [true, 'Please enter a short bio of what you do'],
    minLength: [24, 'Summary should be a minimum of 10 characters'],
    maxLength: [60, 'Summary should be a maximum of 60 characters'],
  },
  summary: {
    type: String,
    default: 'A very versatile software developer',
    minLength: [24, 'Summary should be a minimum of 24 characters'],
    maxLength: [120, 'Summary should be a maximum of 120 characters'],
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
      state: String,
      area: String,
      city: String,
      street: String,
      postal_code: String || Number,
      zip_code: String || Number,
    },
    required: [true, 'company address is required'],
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
});
