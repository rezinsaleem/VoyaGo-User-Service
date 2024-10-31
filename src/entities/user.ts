import mongoose, { Schema } from 'mongoose';
import { UserInterface } from '../utilities/interface';

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userImage: {
      type: String,
    },
    accountStatus: {
      type: String,
      default: 'UnBlocked',
    },
    isVerified: {
      type: String,
      default: 'false',
    },
    verificationDetails: {
      govIdType: { type: String },
      govIdNumber: { type: String },
      document: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model<UserInterface>('Users', UserSchema);

export default userModel;