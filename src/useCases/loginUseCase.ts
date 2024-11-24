import auth from '../middleware/auth';
import UserRepository from '../repositories/userRepo';
import bcrypt from '../services/bcrypt';
import { getOtpByEmail } from '../services/redisClient';
import { UserInterface } from '../utilities/interface';
import { comparePassword } from '../utilities/passwordCompare';
import { sendOtp } from '../utilities/sendOtp';

const userRepository = new UserRepository();

export default class LoginUseCase {
  
  loginUser = async (email: string, password: string) => {
    try {
      const user = (await userRepository.findByEmail(email)) as UserInterface;
      if (!user) {
        return { message: 'UserNotFound' };
      }
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return { message: 'passwordNotMatched' };
      }
      if (user.accountStatus === 'Blocked') {
        return { message: 'blocked' };
      }
      const token = await auth.createToken(user._id.toString(), 'user', '15m');
      const refreshToken = await auth.createToken(user._id.toString(),'user', '7d');
      return {
        message: 'Success',
        name: user.name,
        token,
        _id: user._id,
        refreshToken,
        image: user.userImage,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isVerified: user.isVerified
      };
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  googleLoginUser = async (email: string) => {
    try {
      const user = (await userRepository.findByEmail(email)) as UserInterface;
      if (!user) {
        return { message: 'UserNotFound' };
      }
      if (user.accountStatus === 'Blocked') {
        return { message: 'blocked' };
      }
      const token = await auth.createToken(user._id.toString(),'user', '15m');
      const refreshToken = await auth.createToken(user._id.toString(),'user', '7d');
      return {
        message: 'Success',
        name: user.name,
        token,
        _id: user._id,
        refreshToken,
        image: user.userImage,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isVerified: user.isVerified
      };
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  forgotPassOtp = async ( email: string) => {
    try {
      const user = (await userRepository.findByEmail(email)) as UserInterface;
      const name = user.name
      if (user) {
        const response = await sendOtp({email, name}) 
        return {message: response}
      }
      return {message: 'User Does not Exist'}
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  otpVerify = async ( email: string, otp: string) => {
    try {
      const storedOtp = await getOtpByEmail(email)
      console.log(storedOtp,'stored')
      console.log(otp,'otp')
      console.log(email,'email')
      if(storedOtp === null || storedOtp.toString() !== otp.toString()) {
        console.log("OTP does not match or is not found.")
        return {message: 'OTP does not match or is not found.'}
      }
      const user = (await userRepository.findByEmail(email)) as UserInterface;
      if (user) {
        return { message: 'success' };
      } else {
        return {message: 'User does Not Exist'}
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  updatePassword  = async (
    email:string,
    password: string
  ) => {
    try {
      const user = await userRepository.findByEmail(email);
      if (!user) {
        return { message: 'No User Found' };
      }
      const id = user?._id.toString()
      const hashedPass = await bcrypt.securePassword(password);
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
  }

}