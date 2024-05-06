import { Agenda, Job } from '@hokify/agenda';
import * as dotenv from 'dotenv';
dotenv.config();

const SCHEDULED_TIMEZONE = 'Africa/Lagos';
const agenda = new Agenda({ db: { address: process.env.MONGO_URI || '', collection: 'agenda-jobs' } });

agenda.every('*/1 * * * *', 'UPDATE_USERS_COUNTRY');
agenda.every('59 23 * * 0', 'UPDATE_GROUP_ADMINS_WEEKLY');
agenda.every('0 */3 * * *', 'UPDATE_GROUP_ADMINS');

agenda.on('error', (error) => {
  console.error({ 'Agenda error': error });
});

agenda.on('ready', () => {
  console.log({ agenda_success: 'Agenda connected to the database successfully' });
});

agenda
  .start()
  .then(async () => {})
  .catch((error) => {
    console.error({ 'Failed to start agenda': error });
  });

export default agenda;
