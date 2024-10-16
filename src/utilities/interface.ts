import { Document, ObjectId } from 'mongoose';

export interface UserInterface extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  phoneNumber: number;
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

export interface UpdateUserRequest {
  id: string;
  name: string;
  phoneNumber: number;
  userImage: File | null;
  password: string | null;
}