import { model, Schema } from 'mongoose';
import { CompanyInterface } from '../types';
import { isEmail, isMobilePhone } from 'validator';

const CompanySchema = new Schema<CompanyInterface>(
  {
    email: {
      type: String,
      unique: true,
      validate: [isEmail, 'Please enter a valid email'],
      required: [true, 'company email is required'],
    },
    status: {
      type: String,
      default: 'company',
      immutable: true,
    },
    company_id: {
      type: String,
      lowercase: true,
      immutable: true,
      unique: true,
      required: [true, 'company id is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [5, 'Password must be of minimum 6 characters long !'],
    },
    company_name: {
      type: String,
      required: [true, 'company name is required'],
    },
    website: {
      type: String,
    },
    address: {
      type: {
        country: {
          type: String,
          required: [true, 'country is required'],
        },
        state: String,
        area: String,
        city: String,
        street: String,
        postal_code: String || Number,
        zip_code: String || Number,
      },
      default: { country: 'Nigeria' },
      required: [true, 'company address is required'],
    },
    description: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
    },
    cover_image: {
      type: String,
    },

    category: {
      type: String,
      default: 'IT Company',
      required: [true, 'company category is required'],
    },
    employee_count: {
      type: Number,
      default: 10,
    },

    parent_company: { type: String, default: null },
    incorporation_date: { type: Date, default: Date.now },
    contact_phone: {
      type: String,
      validate: [isMobilePhone, 'please enter a valid phone number'],
    },
    operational_status: {
      type: String,
      lowercase: true,
      enum: ['active', 'inactive', 'restructuring', 'bankruptcy'],
      default: 'active',
    },
    tax_info: { tax_id: String, vat_number: String },
    social_media: {
      facebook: String,
      twitter: String,
      linkedin: String,
      instagram: String,
      youtube: String,
      hashnode: String,
      twitch: String,
      github: String,
    },
  },
  { timestamps: true },
);

const CompanyModel = model('companies', CompanySchema);
export { CompanyModel };
