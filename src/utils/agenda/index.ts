import { Agenda, Job } from '@hokify/agenda';
import * as dotenv from 'dotenv';
import { SEND_JOB_RECOMMENDATIONS } from './send-job-recommendation';
// import { SEND_USER_VISA_EXPIRATION_NOTICE } from './country-change-and-notice';
// import { UPDATE_GROUP_ADMINS_FOR_COMMUNITIES } from './update_community-admins';

dotenv.config();

// SEND_JOB_RECOMMENDATIONS();

const SCHEDULED_TIMEZONE = 'Africa/Lagos';
const agenda = new Agenda({ db: { address: process.env.PROD_MONGO_URI || '', collection: 'agenda-jobs' } });

// agenda.define('UPDATE_USERS_COUNTRY', SEND_USER_VISA_EXPIRATION_NOTICE);
// agenda.define('UPDATE_GROUP_ADMINS_WEEKLY', UPDATE_GROUP_ADMINS_FOR_COMMUNITIES);

agenda.on('error', (error) => {
  console.error({ 'Agenda error': error });
});

agenda.on('ready', () => {
  console.log({ agenda_connected: 'Agenda connected to the database successfully' });
});

agenda
  .start()
  .then(async () => {
    console.log({ agenda_success: 'Agenda started successfully' });

    // Get the list of scheduled jobs
    // const scheduledJobs = await agenda.jobs();
    // Loop through the scheduled jobs and log their details
    // scheduledJobs.forEach((job) => {
    //   console.log({
    //     id: job.attrs._id,
    //     name: job.attrs.name,
    //     schedule: job.attrs.repeatInterval,
    //     next_run: job.attrs.nextRunAt,
    //   });
    // });
  })
  .catch((error) => {
    console.error({ 'Failed to start agenda': error });
  });

agenda.every('1 minute', 'UPDATE_USERS_COUNTRY');
agenda.every('59 23 * * 0', 'UPDATE_GROUP_ADMINS_WEEKLY');

export default agenda;
