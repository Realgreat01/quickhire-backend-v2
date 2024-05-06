import { v4 as uuidv4 } from 'uuid';

export const GENERATE_OTP = () => {
  const max = 9999;
  const min = 1000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const GENERATE_COMMUNITY_ID = () => {
  const id = uuidv4();
  const uuidStr = id.replace(/-/g, '');
  return uuidStr.slice(0, 6);
};
