import { model, Schema } from 'mongoose';
const Increment = new Schema({ count: { type: Number } });

export const IncrementModel = model('counter', Increment);
