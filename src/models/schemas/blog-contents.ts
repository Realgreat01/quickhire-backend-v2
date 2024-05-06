import { Schema } from 'mongoose';
import { isURL } from 'validator';
export const BlogSchema = new Schema({
  blog_title: {
    type: String,
    required: [true, 'Blog title is required'],
    maxLength: [150, 'Blog title should be a maximum of 350 characters'],
  },
  blog_overview: {
    type: String,
    required: [true, 'Blog overview is required'],
    minLength: [50, 'Blog overview should be a maximum of 50 characters'],
    maxLength: [300, 'Blog overview should be a maximum of 350 characters'],
  },
  blog_url: {
    type: String,
    required: [true, 'Blog url is required'],
    validate: [isURL, 'Enter a valid URL'],
  },
});
