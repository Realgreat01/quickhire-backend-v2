import { SEND_JOB_RECOMMENDATIONS_EMAIL } from './job-recommendations';
import { SEND_USER_VERIFICATION_EMAIL } from './verification-email';
import { SEND_USER_WELCOME_EMAIL } from './welcome-email';
// import { SEND_USER_ACCOUNT_DELETION_EMAIL } from './account-deletion-email';
// import { SEND_ACCOUNT_REPORT_NOTICE } from './user-reports';

const EMAIL_SENDER = {
  SEND_USER_VERIFICATION_EMAIL,
  SEND_USER_WELCOME_EMAIL,
  SEND_JOB_RECOMMENDATIONS_EMAIL,
  // SEND_USER_ACCOUNT_DELETION_EMAIL,
  // SEND_ACCOUNT_REPORT_NOTICE,
};

export { EMAIL_SENDER };
