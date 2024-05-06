import { StatusCodes } from 'http-status-codes';
// import {   } from 'http-errors';
import createError from 'http-errors';

const SUCCESS_RESPONSE = (data: object, code: StatusCodes.OK | StatusCodes.CREATED, message: string) => {
  return { data, code, message, success: true };
};

const ERROR_RESPONSE = (error: object, code: number, message: string) => {
  return { error, code, message, success: true };
};

export { SUCCESS_RESPONSE };
