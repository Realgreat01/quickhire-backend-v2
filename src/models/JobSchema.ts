import { model, Schema } from 'mongoose';
import { isDate } from 'validator';
import { JobInterface, InterviewFeedback, UserInterface } from '../types';

const InterviewFeedbackSchema = new Schema<InterviewFeedback>({
  date: { type: Date, required: true },
  // interviewer: { type: Schema.Types.ObjectId, required: true, ref: 'hiring-managers' },
  comments: { type: String, required: true },
  score: Number,
});

const JobSchema = new Schema<JobInterface>(
  {
    posted_by: {
      type: Schema.Types.ObjectId,
      ref: 'companies',
      required: [true, 'identity of hiring company is required'],
    },
    applicants: [
      {
        user: { type: Schema.Types.ObjectId, required: [true], ref: 'users' },
        status: {
          type: String,
          required: true,
          enum: ['submitted', 'received', 'processing', 'accepted', 'rejected'],
          default: 'submitted',
        },
        cover_letter: { type: String },
        interview_feedback: [InterviewFeedbackSchema],
        evaluation_score: { type: Number, default: 0, max: [100, 'evaluation score must be less than 100'] },
        notes: { type: String, default: '' },
        interview_dates: [{ type: Date }],
        date_applied: { type: Date, immutable: true, default: () => Date.now() },
      },
      { timestamps: true },
    ],

    job_title: {
      type: String,
      required: [true, 'job title is required'],
    },
    job_description: {
      type: String,
      required: [true, 'job description is required'],
    },
    job_type: {
      type: String,
      enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Voluntary'],
      default: 'Part-Time',
      required: [true, 'job type is required'],
    },
    posted_on: { type: Date, immutable: true, default: () => Date.now() },
    application_ends: {
      type: Date,
      required: [true, 'job application due date is required'],
      validate: [isDate, 'Enter a valid date'],
    },
    job_duration: {
      type: {
        date: {
          type: String,
          enum: ['week', 'month', 'year'],
          required: [true, 'enter a valid date type'],
          lowercase: true,
        },
        value: { type: Number, required: [true, 'enter a valid number'] },
      },
      required: [true, 'job duration is required'],
    },
    salary: {
      type: {
        currency: { type: String, required: [true, 'enter a valid currency'] },
        value: { type: Number, required: [true, 'enter a valid number'] },
      },
      required: [true, 'job salary is required'],
    },
    required_skills: {
      type: [
        {
          name: { type: String, required: [true, 'name of skill is required'] },
          icon: { type: String, required: [true, 'icon name is required'] },
        },
      ],
      required: [true, 'job skills requirement must be added'],
    },

    job_location_type: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid'],
      required: true,
      lowercase: true,
      default: 'remote',
    },
    job_status: { type: String, enum: ['open', 'closed', 'paused'], default: 'open' },
    experience_level: {
      type: String,
      enum: ['intership', 'entry', 'junior', 'mid', 'senior', 'expert'],
      default: 'mid',
      required: true,
    },
  },
  { timestamps: true },
);

const JobModel = model('jobs', JobSchema);
export { JobModel };
