import UserRepository from '../repositories/userRepo';
import bcrypt from '../services/bcrypt';
import { UpdateUserRequest, UserInterface } from '../utilities/interface';
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

}