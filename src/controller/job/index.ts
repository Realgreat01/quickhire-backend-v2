import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { JobSchema } from '../../models';
import errorHandler from '../../errors';
import { Applicant, JobInterface } from '../../types';

export const GET_COMPANY_JOB = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;
  try {
    const companyJob = await JobSchema.find({ posted_by: id }).populate(
      'posted_by',
      'company_name address logo company_id',
    );
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

  try {
    const job = await JobSchema.findOne({ _id: jobId, posted_by: userId }).populate('applicants.user');
    if (!job) return next(res.error.NotFound('job not found'));
    else return res.success(job.applicants, 'Applicants retrieved successfully');
  } catch (error) {
    next(res.createError(500, '', errorHandler(error)));
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
      for(const key in updates) {
        job.applicants[applicantIndex][key] = updates[key];
        const updatedJob = await job.save();
        return res.success(updatedJob, 'Applicant details updated successfully', 201);
      }
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
    const allJobs = await JobSchema.find()
      .populate('posted_by', 'company_name address logo company_id')
      .populate(
        'applicants.user',
        'username email firstname lastname phone_number experience_level highest_education_level',
      );
    return res.success(allJobs);
  } catch (error) {
    next(res.createError(500, '', errorHandler(error)));
  }
};

export const GET_SINGLE_JOB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobId = req.params.jobId;
    const requestedJob = await JobSchema.findById(jobId).populate(
      'posted_by',
      'company_name address logo company_id',
    );
    return res.success(requestedJob);
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

      if (isApplicant) return next(res.error.Forbidden('You have already applied for this job'));

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
    const jobs = await JobSchema.find({ 'applicants.user': userId }).populate(
      'posted_by',
      'company_name address logo company_id',
    );

    const processedData: any = [];

    jobs.forEach((job: JobInterface) => {
      const { applicants, ...jobDetails } = job.toObject();
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
