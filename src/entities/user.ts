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
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model<UserInterface>('Users', UserSchema);

export default userModel;