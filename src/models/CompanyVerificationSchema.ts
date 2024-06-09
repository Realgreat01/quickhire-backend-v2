import { Schema, model } from 'mongoose';
const VerificationSchema = new Schema(
  {
    company_id: {
      type: Schema.Types.ObjectId,
      required: [true, 'comapny id  is required'],
      unique: [true, 'company is already undergoing verificaion'],
      ref: 'company',
    },
    verification_code: {
      type: String,
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

const VerificationModel = model('company-verifications', VerificationSchema);

export default VerificationModel;
