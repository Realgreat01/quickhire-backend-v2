import type { Types, Document } from 'mongoose';
import type { AddressInterface, JobLocationType, JobType, Skills, SocialLinks } from './utils';

export interface Notification {
  title: string;
  body: string;
  _id: Types.ObjectId;
  created_at: Date;
  is_read: boolean;
  notification_type: 'general' | 'updates' | 'security';
}

export interface BasicDetail extends Document {
  user_id: Types.ObjectId;
  firstname: string;
  lastname: string;
  middlename: string;
  phone_number: string;
  gender: 'male' | 'female' | 'others';
  about_me: string;
  header_bio: string;
  summary: string;
  cover_letter: string;
  hobbies?: string[];
  interests?: string[];
  address: AddressInterface;
  reference: Reference[];
  social_media: SocialLinks;
  experience_level: 'entry' | 'mid' | 'senior';
}
interface Reference {
  name: string;
  title: string;
  relationship: string;
}

export interface Education extends Document {
  institution: string;
  course: string;
  entry_date: Date;
  graduation_date: Date;
  type:
    | 'Bachelors'
    | 'Masters'
    | 'Doctorate'
    | 'Elementary'
    | 'Diploma'
    | 'High School'
    | 'Certificate'
    | 'Associate Degree'
    | 'Professional Training';
  school_website: string;
  gpa?: number;
  description: string;
}

export interface Experience extends Document {
  company: string;
  contributions: string;
  company_location: string;
  location_type: JobLocationType;
  job_type: JobType;
  start_date: Date;
  end_date: Date | null;
  role: string;
}

export interface Project extends Document {
  description: string;
  title: string;
  motivations: string;
  tools_used: Skills[];
  repository: string;
  preview_url: string;
  role?: string;
  project_type?: 'commercial' | 'academic' | 'personal' | 'open source';
  images_or_screenshots?: string[];
  status?: 'completed' | 'in progress' | 'on hold';
}

export interface UserSkills extends Document {
  stack: string;
  top_skills: Skills[];
  programming_languages: Skills[];
  frameworks: Skills[];
  technologies: Skills[];
  others: string[];
  soft_skills: string[];
}

export interface UserInterface extends Document {
  email: string;
  username: string;
  profile_picture: string;
  password: string;
  status: 'user';
  user_id: Types.ObjectId;
  firstname: string;
  lastname: string;
  middlename: string;
  phone_number: string;
  gender: 'male' | 'female' | 'others';
  about_me: string;
  header_bio: string;
  summary: string;
  cover_letter: string;
  hobbies?: string[];
  interests?: string[];
  address: AddressInterface;
  reference: Reference[];
  social_media: SocialLinks;
  experience_level: 'entry' | 'mid' | 'senior';
  rate: number;
  highest_education_level: Education['type'];
  interest_job: JobLocationType;
  availability: string;
  blogs: object[];
  notifications: Notification[];
  projects: Project[];
  experience: Experience[];
  skills: UserSkills;
  education: Education[];
}
