import { HTML_TO_TEXT } from './../../utils';
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { CompanySchema, JobSchema, UserSchema } from '../../models';
import errorHandler from '../../errors';
import { Applicant, JobInterface } from '../../types';
import { DateTime } from 'luxon';
import ContentBasedRecommender from 'content-based-recommender-ts';

export const GET_COMPANY_JOB = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;
  try {
    const companyJob = await JobSchema.find({ posted_by: id })
      .populate('posted_by', 'company_name address logo company_id')
      .sort({ createdAt: -1 })
      .lean();
    return res.success(companyJob, 201);
  } catch (error) {
    next(res.createError(500, '', errorHandler(error)));
  }
};
export const GET_SINGLE_COMPANY_JOB = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user.id;
  const jobId = req.params.jobId;
  try {
    const companyJob = await JobSchema.findOne({ posted_by: userId, _id: jobId });
    return res.success(companyJob);
  } catch (error) {
    next(res.createError(500, '', errorHandler(error)));
  }
};

export const POST_NEW_JOB = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;
  try {
    const newJob = await (
      await JobSchema.create({ ...req.body, posted_by: id })
    ).populate('posted_by', 'company_name address logo company_id');
    return res.success(newJob);
  } catch (error) {
    return res.status(500).json(errorHandler(error));
  }
};

export const UPDATE_JOB = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user.id;
  const jobId = req.params.jobId;
  try {
    const updatedJob = await JobSchema.findOneAndUpdate({ posted_by: userId, _id: jobId }, req.body, {
      new: true,
    });
    return res.success(updatedJob, 201);
  } catch (error) {
    next(res.createError(500, '', errorHandler(error)));
  }
};

export const GET_JOB_APPLICANTS = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user.id; // Assuming this is the company's user ID
  const jobId = req.params.jobId;

  const recommender = new ContentBasedRecommender();

  try {
    const job = await JobSchema.findOne({ _id: jobId, posted_by: userId })
      .populate('applicants.user', '-password')
      .lean();

    if (job) {
      const applicants = job?.applicants.map(({ user }, index) => {
        const skills = user?.skills.top_skills.map((skill) => skill.name);
        return {
          id: `${index}`,
          content: `${user?.header_bio} ${skills?.join(' ')} ${user?.experience_level} ${user?.job_interest} ${user?.years_of_experience} ${user?.highest_education_level} ${user?.address.country}`,
        };
      });

      const company = await CompanySchema.findById(userId);
      const currentJobFn = () => {
        const skills = job.required_skills.map((skill) => skill.name);
        if (applicants && applicants.length > 0) {
          return {
            id: `${applicants.length + 1 ?? 1}`,
            content: `${job.job_title} ${skills.join(' ')} ${job.experience_level} ${job.job_location_type}  ${company?.address.country}`,
          };
        } else {
          return {
            id: '1',
            content: `${job.job_title} ${skills.join(' ')} ${job.experience_level} ${job.job_location_type} ${job.job_type}`,
          };
        }
      };

      const currentJob = currentJobFn();
      applicants.push(currentJob);

      console.log({ applicants, currentJob });

      recommender.train(applicants);

      const matchedApplicants = recommender.getSimilarDocuments(currentJob.id);
      const topApplicants = matchedApplicants.map((app) => job.applicants[app.id]);
      if (topApplicants.length > 0) return res.success(topApplicants);
      else return res.success(job.applicants);
    } else return next(res.error.NotFound('job not found'));
  } catch (error) {
    return next(res.createError(500, '', errorHandler(error)));
  }
};

export const GET_JOB_APPLICANT = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user.id; // Assuming this is the company's user ID
  const jobId = req.params.jobId;
  const applicantId = req.params.applicantId;

  try {
    const job = await JobSchema.findOne({ _id: jobId, posted_by: userId }).populate(
      'applicants.user',
      'email username firstname lastname profile_picture experience_level job_interest rate hightest_education_level skills ',
    );
    if (!job) return next(res.error.NotFound('job not found'));

    const applicantIndex = job.applicants.findIndex(
      (applicant) => applicant.user._id.toString() === applicantId,
    );
    if (applicantIndex === -1) return next(res.error.NotFound('Applicant not found in this job'));
    return res.success(job.applicants[applicantIndex]);
  } catch (error) {
    next(res.createError(500, '', errorHandler(error)));
  }
};

export const UPDATE_JOB_APPLICANT = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user.id; // Assuming this is the company's user ID
  const jobId = req.params.jobId;
  const applicantId = req.params.applicantId;
  const updates = req.body;

  try {
    const job = await JobSchema.findOne({ _id: jobId, posted_by: userId });
    if (!job) return next(res.error.NotFound('job not found'));
    else {
      const applicantIndex = job.applicants.findIndex((user) => user.user.toString() === applicantId);
      if (applicantIndex === -1) return next(res.error.NotFound('Applicant not found in this job'));
      for (const key in updates) {
        job.applicants[applicantIndex][key] = updates[key];
      }
      const updatedJob = await job.save();
      return res.success(updatedJob, 'Applicant details updated successfully', 201);
    }
  } catch (error) {
    next(res.createError(500, '', errorHandler(error)));
  }
};

export const DELETE_JOB = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user.id;
  const jobId = req.params.jobId;
  try {
    await JobSchema.findOneAndDelete({ posted_by: userId, _id: jobId });
    return res.success({ message: 'Job successfully deleted' });
  } catch (error) {
    next(res.createError(500, '', errorHandler(error)));
  }
};

export const GET_ALL_JOBS = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recommender = new ContentBasedRecommender({
      minScore: 0.1,
      maxSimilarDocs: 1000,
      debug: false,
      maxVectorSize: 100,
    });

    const allJobs = await JobSchema.find({ job_status: 'open' })
      .populate('posted_by', 'company_name address logo company_id')
      .populate(
        'applicants.user',
        'username email firstname lastname phone_number experience_level highest_education_level',
      )
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const formattedJob = allJobs.map((job) => {
      const dateToCheck = DateTime.fromISO(new Date(job.posted_on).toISOString());
      const now = DateTime.local();
      const isLessThan7DaysAgo = dateToCheck >= now.minus({ days: 7 });

      job['is_new'] = isLessThan7DaysAgo;

      if (req.user) {
        if (job.applicants.some((applicant: any) => applicant.user._id.toString() === req.user.id)) {
          job['is_applicant'] = true;
        } else job['is_applicant'] = false;
      } else job['is_applicant'] = false;
      return job;
    });

    return res.success(formattedJob);
  } catch (error) {
    next(res.createError(500, '', errorHandler(error)));
  }
};

// job search from query
export const GET_MATCHED_JOBS = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recommender = new ContentBasedRecommender({
      minScore: 0.1,
      maxSimilarDocs: 100,
      debug: false,
      maxVectorSize: 100,
    });

    const allJobs = await JobSchema.find()
      .populate('posted_by', 'company_name address logo company_id')
      .populate(
        'applicants.user',
        'username email firstname lastname phone_number experience_level highest_education_level',
      )
      .sort({ createdAt: -1 })
      .lean();

    const formattedJob = allJobs.map((job) => {
      const dateToCheck = DateTime.fromISO(new Date(job.posted_on).toISOString());
      const now = DateTime.local();
      const isLessThan7DaysAgo = dateToCheck >= now.minus({ days: 7 });

      job['is_new'] = isLessThan7DaysAgo;
      if (req.user) {
        const isApplicant = job.applicants.some(
          (applicant: any) => applicant.user.toString() === req.user.id,
        );

        job['is_applicant'] = isApplicant;
      } else job['is_applicant'] = false;
      return job;
    });

    const jobsByIndex = formattedJob.map(({ ...content }, index) => ({
      id: index,
      content,
    }));

    const aggregatedJobs = allJobs.map((job, index) => {
      const skills = job.required_skills.map((skill) => skill.name);

      return {
        id: `${index}`,
        content:
          `${job.job_title} ${job.job_title} ${skills.join(' ')} ${job.experience_level} ${job.job_type}  ${job.job_location_type} ${HTML_TO_TEXT(job.job_description)}`.toLowerCase(),
      };
    });

    const query = {
      id: `${aggregatedJobs.length + 1}`,
      content:
        `${req.query.title ?? ''} ${req.query.location ?? ''} ${req.query.type ?? ''} ${req.query.level ?? ''}`.toLowerCase(),
    };
    aggregatedJobs.push(query);
    recommender.train(aggregatedJobs);
    const matchedJobs = recommender.getSimilarDocuments(query.id);

    const jobs = matchedJobs.map((job: any) => jobsByIndex[job.id].content);
    return res.success(jobs);
  } catch (error) {
    next(res.createError(500, '', errorHandler(error)));
  }
};

export const GET_SINGLE_JOB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobId = req.params.jobId;

    const job = await JobSchema.findById(jobId)
      .populate('posted_by', 'company_name address logo company_id')
      .lean();

    if (job) {
      const dateToCheck = DateTime.fromISO(new Date(job.posted_on).toISOString());
      const now = DateTime.local();
      const isLessThan7DaysAgo = dateToCheck >= now.minus({ days: 7 });

      job['is_new'] = isLessThan7DaysAgo;

      if (req.user) {
        const isApplicant = job.applicants.some(
          (applicant: any) => applicant.user.toString() === req.user.id,
        );

        job['is_applicant'] = isApplicant;
      }

      return res.success(job);
    }
  } catch (error) {
    next(res.createError(400, '', errorHandler(error)));
  }
};

export const APPLY_FOR_JOB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.jobId;
    const job = await JobSchema.findById(jobId);
    if (!job) return next(res.error.NotFound('Job not found'));
    else {
      const isApplicant = job.applicants.find((applicant: any) =>
        applicant.user.equals(new Types.ObjectId(userId)),
      );

      if (isApplicant) throw Error('You have already applied for this job');

      const appliedJob = await JobSchema.findByIdAndUpdate(
        jobId,
        { $push: { applicants: { user: userId } } },
        { new: true },
      );
      return res.success(appliedJob);
    }
  } catch (error) {
    return next(res.createError(500, '', errorHandler(error)));
  }
};

export const GET_APPLIED_JOBS = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const jobs = await JobSchema.find({ 'applicants.user': userId })
      .populate('posted_by', 'company_name address logo company_id')
      .sort({ createdAt: -1 })
      .lean();

    const processedData: any = [];

    jobs.forEach((job: JobInterface) => {
      const { applicants, ...jobDetails } = job;
      const currentApplicant = applicants.find(
        (applicant: Applicant) => applicant.user.toString() === userId,
      );
      if (currentApplicant) {
        jobDetails['candidate'] = currentApplicant;
        jobDetails['applicants_count'] = applicants.length;
        processedData.push(jobDetails);
      }
    });
    return res.success(processedData);
  } catch (error) {
    next(res.createError(400, '', errorHandler(error)));
  }
};

export const GET_SIMILAR_JOBS = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobId = req.params.id;
    const recommender = new ContentBasedRecommender({
      minScore: 0.1,
      maxSimilarDocs: 10,
      maxVectorSize: 100,
      debug: false,
    });
    const allJobs = await JobSchema.find().lean();
    const otherJobs = await JobSchema.find({ _id: { $ne: new Types.ObjectId(jobId) } })
      .lean()
      .sort({ createdAt: -1 })
      .limit(9);

    const jobsByIndex = allJobs.map(({ ...content }, index) => ({
      id: index,
      content,
    }));

    const currentJob = allJobs.findIndex((job) => job._id.toString() === jobId);

    const formatedJob = allJobs.map((job, index) => {
      const skills = job.required_skills.map((skill) => skill.name);
      return {
        id: `${index}`,
        content: `${job.job_title} ${job.job_title} ${job.experience_level} ${skills.join(' ')} ${job.job_type}  ${job.job_location_type}`,
      };
    });

    recommender.train(formatedJob);
    const similarJob = recommender.getSimilarDocuments(`${currentJob}`, 0, 9);

    const jobs = similarJob.map((job: any) => jobsByIndex[job.id].content);
    if (jobs.length > 0) return res.success(jobs);
    else return res.success(otherJobs);
  } catch (e) {}
};

export const GET_JOB_RECOMMENDATIONS = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user.id; // Assuming this is the company's user ID

  const recommender = new ContentBasedRecommender({
    minScore: 0.1,
    maxSimilarDocs: 100,
    maxVectorSize: 100,
    debug: false,
  });

  try {
    const allJobs = await JobSchema.find({ job_status: 'open' }).sort({ createdAt: -1 }).lean();

    const user = await UserSchema.findById(userId);

    const aggregatedJobs = allJobs.map((job, index) => {
      const skills = job.required_skills.map((skill) => skill.name);
      return {
        id: `${index}`,
        content:
          `${job.job_title} ${job.job_title} ${skills.join(' ')} ${job.experience_level} ${job.job_type}  ${job.job_location_type}`.toLowerCase(),
      };
    });

    const currentUser = () => {
      const skills = user?.skills.top_skills.map((skill) => skill.name);
      return {
        id: `${aggregatedJobs.length}`,
        content: `${user?.header_bio} ${skills?.join(' ')} ${user?.experience_level} ${user?.job_interest} ${user?.years_of_experience} ${user?.highest_education_level} ${user?.address.country}`,
      };
    };

    const formattedUser = currentUser();
    aggregatedJobs.push(formattedUser);

    recommender.train(aggregatedJobs);

    const matchedJobs = recommender.getSimilarDocuments(formattedUser.id);
    const recommendedJobs = matchedJobs.map((job) => allJobs[job.id]);
    return res.success(recommendedJobs, 'Applicants retrieved successfully');
  } catch (error) {
    next(res.createError(500, '', errorHandler(error)));
  }
};

const updateJobs = async () => {
  try {
    await JobSchema.updateMany({}, { applicants: [] });
  } catch (error) {}
};

// updateJobs();
