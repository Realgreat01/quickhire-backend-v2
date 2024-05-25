import { Schema, model } from 'mongoose';
import { isEmail } from 'validator';

interface EmailListInterface {
  email: string;
  firstname: string;
  lastname: string;
}
const EmailListModelSchema = new Schema<EmailListInterface>({
  email: {
    type: String,
    minLength: [5, 'email is too short'],
    required: [true, 'email is required'],
    lowercase: true,
    unique: true,
    validate: [isEmail, 'please enter a valid email address'],
  },

  firstname: {
    type: String,
    minLength: [2, 'firstname is too short'],
    required: [true, 'firstname is required'],
    validate: {
      validator: (value: string) => /^[a-zA-Z]+$/.test(value),
      message: 'firstname must contain only letters',
    },
  },
  lastname: {
    type: String,
    minLength: [2, 'lastname is too short'],
    required: [true, 'lastname is required'],
    validate: {
      validator: (value: string) => /^[a-zA-Z]+$/.test(value),
      message: 'lastname must contain only letters',
    },
  },
});

const EmailListModel = model('email-list', EmailListModelSchema);
export { EmailListModel };
