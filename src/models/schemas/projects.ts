import { Project } from '../../types';

import { Schema } from 'mongoose';
import { isURL } from 'validator';

export const ProjectSchema = new Schema<Project>({
  title: {
    type: String,
    required: [true, 'Project title is required'],
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
  },
  role: { type: String, default: 'owner' },
  project_type: {
    type: String,
    enum: ['commercial', 'academic', 'personal', 'open source'],
    default: 'personal',
  },
  // images_or_screenshots: [{ type: String }],
  // screenshots: [{ type: String }],
  screenshot: {
    type: String,
    default: 'https://res.cloudinary.com/dirmjuvyr/image/upload/v1716625576/quickhire/no-photo_ctytmq.jpg',
  },
  status: {
    type: String,
    enum: ['completed', 'in progress', 'on hold'],
    default: 'in progress',
  },
  motivations: {
    type: String,
    required: [true, 'Project main lesson is required'],
  },
  tools_used: {
    type: [{ name: String, icon: String }],
    required: [true, 'Project tools is required'],
  },
  repository: {
    type: String,
    required: [true, 'Project repository is required'],
    validate: [isURL, 'Enter a valid URL'],
  },
  preview_url: {
    type: String,
    required: [true, 'Project preview link is required'],
    validate: [isURL, 'Enter a valid URL'],
  },
});
