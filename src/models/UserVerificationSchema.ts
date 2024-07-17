import { Schema, model } from 'mongoose';
const VerificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, 'user id name is required'],
      unique: [true, 'user is already undergoing verificaion'],
      ref: 'users',
    },
    verification_code: {
      type: Number,
      required: [true, 'verification code is required'],
    },
    expire_at: {
      type: Date,
      default: Date.now,
      expires: 300,
    },
  },
  { timestamps: true },
);

export const UserVerificationModel = model('user-verifications', VerificationSchema);
