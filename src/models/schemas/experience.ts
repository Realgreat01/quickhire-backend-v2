import { Experience } from '../../types';

import { Schema } from 'mongoose';
export const ExperienceSchema = new Schema<Experience>({
  company: {
    type: String,
    minLength: [3, 'Enter a valid company name'],
    required: [true, 'Company name is required'],
  },
  contributions: {
    type: String,
    required: [true, 'Contributions are required'],
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
  },
  start_date: { type: Date, required: [true, 'Start date is required'] },
  end_date: { type: Date, default: null },
  company_location: { type: String, required: true },
  location_type: {
    type: String,
    enum: ['remote', 'onsite', 'hybrid'],
    default: 'remote',
    required: [true, 'Location type is required'],
  },
  job_type: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Contract', 'Temporary', 'Internship'],
    default: 'Full-Time',
    required: true,
  },
});
