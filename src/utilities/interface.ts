import { Document, ObjectId } from 'mongoose';

export interface UserInterface extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  mobile: number;
  password: string;
  userImage: string;
  accountStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterUser {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  userImage: string;
}