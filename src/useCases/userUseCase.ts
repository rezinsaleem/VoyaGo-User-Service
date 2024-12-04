import UserRepository from '../repositories/userRepo';
import bcrypt from '../services/bcrypt';
import { sendMail } from '../services/sendMail';
import { UpdateUserRequest, UserInterface, VerifyUserRequest } from '../utilities/interface';
import { comparePassword } from '../utilities/passwordCompare';

const userRepository = new UserRepository();

export default class UserUseCase {


  updateUser = async (id: string, updates: Partial<UpdateUserRequest>) => {
    try {
      const user = (await userRepository.findById(id)) as UserInterface;
      if (user) {
        const response = await userRepository.findByIdAndUpdate(id, updates);
        if (response.message === 'UserUpdated') {
          const user = (await userRepository.findById(id)) as UserInterface;
          return { message: 'success', name: user.name, phoneNumber: user.phoneNumber, userImage: user.userImage};
        } else {
          return { message: 'User Not Updated' };
        }
      }
      return { message: 'User does not exist' };
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  changePassword = async (
    id: string,
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      const user = await userRepository.findById(id);
      if (!user) {
        return { message: 'No User Found' };
      }
      const isMatch = await comparePassword(currentPassword, user.password);
      if (!isMatch) {
        return { message: 'Entered current password is invalid' };
      }
      const hashedPass = await bcrypt.securePassword(newPassword);
      const updates = { password: hashedPass };
      const response = await userRepository.findByIdAndUpdate(id, updates);
      if (response.message === 'UserUpdated') {
        console.log('Password changed successfully');
        return { message: 'success' };
      } else {
        return { message: 'User Not Updated' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  getUsers = async () => {
    try {
      const users = await userRepository.findAll();
      if (users && users.length > 0) {
        return { users };
      } else {
        return { message: 'No Users Found' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  blockUser = async (id: string, accountStatus: string) => {
    try {
      const user = (await userRepository.findById(id)) as UserInterface;
      if (user) {
        const updates: { [key: string]: any } = {};
        if (accountStatus === 'Blocked') {
          updates.accountStatus = 'Blocked';
        }
        if (accountStatus === 'UnBlocked') {
          updates.accountStatus = 'UnBlocked';
        }
        const response = await userRepository.findByIdAndUpdate(id, updates);
        if (response.message === 'UserUpdated') {
          return { message: 'success' };
        } else {
          return { message: 'Request Failed' };
        }
      }
      return { message: 'Expert does not exist' };
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  isBlocked = async (id: string) => {
    try {
      const user = await userRepository.find(id);
      if (user?.accountStatus === 'Blocked') {
        return { message: 'Blocked' };
      } else if (user?.accountStatus === 'UnBlocked') {
        return { message: 'UnBlocked' };
      } else {
        return { message: 'No User Found' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  verifyUser = async (id: string, updates: Partial<VerifyUserRequest>) => {
    try {
      const user = (await userRepository.findById(id)) as UserInterface;
      if (user) {
        const response = await userRepository.findByIdAndUpdate(id, updates);
        if (response.message === 'UserUpdated') {
          return { message: 'success', isVerified: 'pending' };
        } else {
          return { message: 'Verification Request Failed' };
        }
      }
      return { message: 'Expert does not exist' };
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  getUser = async (id: string) => {
    try {
      const user = await userRepository.findById(id);
      if (user) {
        const response = {
          message: 'success',
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          userImage: user.userImage,
          accountStatus: user.accountStatus,
          isVerified: user.isVerified,
          verificationDetails: user.verificationDetails,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        };
        return { ...response };
      } else {
        return { message: 'No User Found' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  userVerification = async (id: string, action: string, reason?: string) => {
    try {
      console.log(id, action, reason);
      const user = await userRepository.findById(id);
      if (!user) {
        return { message: 'No User Found' };
      }
      const updates: { [key: string]: any } = {};

      if (action === 'accepted') {
        updates.isVerified = 'true';
        const response = await userRepository.findByIdAndUpdate(id, updates);
        if (response.message === 'UserUpdated') {
          console.log('User Verified Successfully');
          const subject: string = 'Verification Request';
          const text: string =
            `Hello ${user.name},\n\n` +
            `Congratulations! Your account with VoyaGo has been successfully verified.\n` +
            `Thank you for being a part of our community!\n\n` +
            `If you have any questions or need assistance, feel free to reach out to our support team.\n\n` +
            `Welcome and have a wonderful day!`;
          await sendMail(user.email, subject, text);
          return { message: 'verified' };
        } else {
          return { message: 'User Not Updated' };
        }
      } else if (action === 'rejected') {
        updates.isVerified = 'rejected';
        const response = await userRepository.findByIdAndUpdate(id, updates);
        if (response.message === 'UserUpdated') {
          console.log('User Verification Rejected');
          const subject: string = 'Verification Request';
          const text: string =
            `Hello ${user.name},\n\n` +
            `We regret to inform you that your account with VoyaGo has not been verified.\n` +
            `Reason for rejection: ${reason}\n\n` +
            `If you believe this decision was made in error or if you have any questions, please don't hesitate to contact our support team for further assistance.\n\n` +
            `Thank you for your understanding, and we wish you all the best.\n\n` +
            `Best regards,\n` +
            `The VoyaGo Team`;
          await sendMail(user.email, subject, text);
          return { message: 'rejected' };
        } else {
          return { message: 'User Not Updated' };
        }
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  getUsersByRides = async (riderIds: string[]) => {
    try {
      const users = await userRepository.findRider(riderIds);
      if (users && users.length > 0) {
        return { users };
      } else {
        return { message: 'No Riders Found' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

}