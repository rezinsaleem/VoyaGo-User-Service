import auth from '../middleware/auth';
import UserRepository from '../repositories/userRepo';
import { UserInterface } from '../utilities/interface';
import { comparePassword } from '../utilities/passwordCompare';

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
      const token = await auth.createToken(user._id.toString(), '15m');
      const refreshToken = await auth.createToken(user._id.toString(), '7d');
      return {
        message: 'Success',
        name: user.name,
        token,
        _id: user._id,
        refreshToken,
        image: user.userImage,
        email: user.email,
        phoneNumber: user.phoneNumber,
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
      const token = await auth.createToken(user._id.toString(), '15m');
      const refreshToken = await auth.createToken(user._id.toString(), '7d');
      return {
        message: 'Success',
        name: user.name,
        token,
        _id: user._id,
        refreshToken,
        image: user.userImage,
        email: user.email,
        phoneNumber: user.phoneNumber,
      };
    } catch (error) {
      return { message: (error as Error).message };
    }
  };
}