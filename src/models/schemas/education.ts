import { Schema } from 'mongoose';
import { Education } from '../../types';
import { isDate } from 'validator';
import isURL from 'validator/lib/isURL';
export const EducationSchema = new Schema<Education>({
  institution: {
    type: String,
    required: [true, 'institution name is required'],
  },
  course: {
    type: String,
    required: [true, 'course is required'],
  },
  entry_date: {
    type: Date,
    required: [true, 'Entry date is required'],
    validate: [isDate, 'Please enter a valid date'],
  },
  graduation_date: {
    type: Date,
    required: [true, 'Graduation date is required'],
    validate: [isDate, 'Please enter a valid date'],
  },
  type: {
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
  school_website: { type: String, validate: [isURL, 'please enter a valid url'] },
  gpa: { type: Number, default: 0 },
  description: { type: String, default: null },
});
