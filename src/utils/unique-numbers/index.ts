import { v4 as uuidv4 } from 'uuid';

const GENERATE_OTP = () => {
  const max = 9999;
  const min = 1000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const GENERATE_REPORT_ID = () => {
  const id = uuidv4();
  const uuidStr = id.replace(/-/g, '');
  return uuidStr.slice(0, 12);
};

export const UNIQUE_NUMBERS = {
  GENERATE_OTP,
  GENERATE_REPORT_ID,
};
