import { DateTime } from 'luxon';
import { Job } from '@hokify/agenda';
import { UserSchema, JobSchema } from '../../models';
import ContentBasedRecommender from 'content-based-recommender-ts';
import { UserInterface, JobInterface, JobRecommendationEmailData } from '../../types';
import { API_SERVICE, EMAIL_SENDER } from '../../utils/';

export const SEND_JOB_RECOMMENDATIONS = async () => {
  try {
    const latestJobs = await JobSchema.find({ job_status: 'open' })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('posted_by', 'company_name address logo company_id')
      .populate(
        'applicants.user',
        'username email firstname lastname phone_number experience_level highest_education_level',
      )
      .lean();

    const allUsers = await UserSchema.find();

    const aggregatedJobs = latestJobs.map((job, index) => {
      const skills = job.required_skills.map((skill) => skill.name);
      return {
        id: `${index}`,
        content:
          `${job.job_title} ${job.job_title} ${skills.join(' ')} ${job.experience_level} ${job.job_type}  ${job.job_location_type}`.toLowerCase(),
      };
    });

    const currentUser = (user?: UserInterface) => {
      const skills = user?.skills?.top_skills.map((skill) => skill.name);
      return {
        id: `${aggregatedJobs.length}`,
        content: `${user?.header_bio} ${user?.skills?.stack} ${skills?.join(' ')} ${user?.experience_level} ${user?.job_interest} ${user?.years_of_experience} ${user?.highest_education_level} ${user?.address.country}`,
      };
    };

    const EmailData: JobRecommendationEmailData[] | any = [];

    const getUserRecommendations = (user: UserInterface) => {
      const recommender = new ContentBasedRecommender({
        minScore: 0.01,
        maxSimilarDocs: 100,
        maxVectorSize: 100,
        debug: false,
      });

      const aggregatedJobs = latestJobs
        .filter((job: JobInterface) => !job.applicants.some((applicant) => applicant.user._id === user._id))
        .map((job, index) => {
          const skills = job.required_skills.map((skill) => skill.name);
          return {
            id: `${index}`,
            content:
              `${job.job_title} ${skills.join(' ')} ${job.experience_level} ${job.job_type} ${job.job_location_type}`.toLowerCase(),
          };
        });

      const formattedUser = currentUser(user);
      const formattedJobs = [...aggregatedJobs, formattedUser];
      recommender.train(formattedJobs);
      const matchedJobs = recommender.getSimilarDocuments(formattedUser.id);
      const recommendedJobs: JobInterface[] = matchedJobs.map((job) => latestJobs[job.id]);

      EmailData.push({
        user: { id: user._id as string, name: `${user.firstname} ${user.lastname}`, email: user.email },
        job: recommendedJobs.map((job) => {
          return {
            id: String(job._id),
            title: job.job_title,
            url: `https://www.quickhire.site/jobs/${job._id}`,
            icon: job.posted_by?.logo as string,
            company: job.posted_by.company_name,
            location: job.posted_by.address?.country,
            experienceLevel: job.experience_level,
            type: job.job_type,
            locationType: job.job_location_type,
          };
        }),
      });
    };

    // const userIds = ['663323c724e1e8bcefdadff5', '663f2df3ea6079e48c567fe1', '664cf120924a32162bf466c0'];

    allUsers.map((user) => {
      // if (userIds.includes(String(user._id))) {
      getUserRecommendations(user);
      // }
    });

    await EMAIL_SENDER.SEND_JOB_RECOMMENDATIONS_EMAIL(EmailData);

    return EmailData;
  } catch (error) {
    console.log(error);
  }
};
