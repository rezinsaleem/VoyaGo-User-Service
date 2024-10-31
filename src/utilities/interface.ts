import { Document, ObjectId } from 'mongoose';

export interface VerificationDetails {
  govIdType?: string;
  govIdNumber?: string;
  document?: string;
}

export interface UserInterface extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  phoneNumber: number;
  password: string;
  userImage: string;
  accountStatus: string;
  isVerified: string;
  verificationDetails?: VerificationDetails;
  createdAt: Date;
  updatedAt: Date;
}

export interface VerifyUserRequest {
  id: string;
  verificationDetails: {
    govIdType: string;
    govIdNumber: string;
    document: string;
  };
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