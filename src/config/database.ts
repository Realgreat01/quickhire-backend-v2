import { UserSchema } from '../models';
import { UserInterface } from '../interface/';
import { Types } from 'mongoose';

export function LIMIT_ARRAY(limit: number) {
  return function (value: any[]) {
    return value.length <= limit;
  };
}
export {};
