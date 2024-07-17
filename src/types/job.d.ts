import type { Types, Document } from 'mongoose';
import { JobLocationType, JobType, Skills } from './utils';
import { UserInterface } from './user';
import { CompanyInterface } from './company';

export interface Applicant {
  user: UserInterface;
  status: 'submitted' | 'received' | 'processing' | 'accepted' | 'rejected';
  cover_letter?: string;
  interview_feedback?: InterviewFeedback[];
  evaluation_score?: number | string;
  notes?: string;
  interview_dates?: Date[];
  date_applied: Date;
}
type ExperienceLevel = 'intership' | 'entry' | 'junior' | 'mid' | 'senior' | 'expert';
export interface JobRecommendationEmailData {
  user: { id: string | Types.ObjectId; name: string; email: string };
  job: {
    id: string;
    title: string;
    url: string;
    icon?: string | any;
    company: string;
    location?: string; // using optional because address?.country might not exist
    experienceLevel: ExperienceLevel;
    type: JobType;
    locationType: JobLocationType;
  }[];
}
interface ApplicationStatus {
  initialSubmission: 'submitted' | 'received';
  reviewProcess: 'processing' | 'under review' | 'background check' | 'reference check';
  interviewPhase: 'shortlisted' | 'interview scheduled' | 'interviewed';
  decisionPhase: 'offer made' | 'offer accepted' | 'offer declined';
  finalStatus: 'accepted' | 'rejected' | 'withdrawn' | 'no show' | 'on hold';
}

export interface InterviewFeedback extends Document {
  date: Date;
  interviewer: Types.ObjectId;
  comments: string;
  score?: number;
}

export interface JobDuration {
  date: 'week' | 'month' | 'year';
  value: number;
}

export interface Salary {
  currency: string;
  value: number;
}

export interface JobInterface extends Document {
  posted_by: CompanyInterface;
  applicants: Applicant[];
  job_title: string;
  job_description: string;
  job_type: JobType;
  posted_on: Date;
  application_ends?: Date | null;
  job_duration: JobDuration;
  job_location_type: JobLocationType;
  salary: Salary;
  job_status: 'open' | 'closed' | 'paused';
  experience_level: ExperienceLevel;
  required_skills: Skills[];
}
