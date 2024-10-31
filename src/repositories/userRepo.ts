import User from '../entities/user';
import { RegisterUser, UpdateUserRequest, UserInterface } from '../utilities/interface';

export default class UserRepository {
  
  findByEmail = async (email: string): Promise<UserInterface | null> => {
    try {
      const userData = await User.findOne({ email });
      return userData;
    } catch (error) {
      console.error('Error in findByEmail:', (error as Error).message);
      return null;
    }
  };

  saveUser = async (userData: RegisterUser): Promise<{ message: string }> => {
    const newUser = new User({
      name: userData.name,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      password: userData.password,
      userImage: userData.userImage,
    });

    try {
      await newUser.save();
      console.log('User saved into the database.');
      return { message: 'UserCreated' }; 
    } catch (error) {
      console.error('Error saving user:', (error as Error).message);
      return { message: (error as Error).message }; 
    }
  };

  findById = async (id: string) => {
    try {
      const user = await User.findById(id)
      return user;
    } catch (error) {
      console.error('Error finding service: ', (error as Error).message);
      throw new Error('Service search failed');
    }
  };

  findByIdAndUpdate = async (
    id: string,
    updates: Partial<UpdateUserRequest> ,
  ): Promise<{ message: string }> => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      );
      if (!updatedUser) {
        console.log('User not found.');
        return { message: 'User not found.' };
      }
      console.log('User updated successfully.');
      return { message: 'UserUpdated' };
    } catch (error) {
      console.error('Error updating user:', (error as Error).message);
      return { message: (error as Error).message };
    }
  };

  findAll = async () => {
    try {
      const users = await User.find()
      return users;
    } catch (error) {
      console.error('Error finding User: ', (error as Error).message);
      throw new Error('User search failed');
    }
  }; 

  find = async (id: string) => {
    try {
      const user = await User.findById(id)
      return user;
    } catch (error) {
      console.error('Error finding service: ', (error as Error).message);
      throw new Error('Service search failed');
    }
  };
  
}