import auth from "../middleware/auth";
import UserRepository from "../repositories/userRepo";
import bcrypt from "../services/bcrypt";
import { getOtpByEmail } from "../services/redisClient";
import { UserInterface } from "../utilities/interface";
import { sendOtp } from "../utilities/sendOtp";

const userRepository = new UserRepository();

export default class RegisterUseCase {
  signupOtp = async (name: string, email: string) => {
    try {
      const user = (await userRepository.findByEmail(email)) as UserInterface;
      if (user) {
        return { message: 'UserExist' };
      }
      const response = await sendOtp({ email, name });
      return { message: response };
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  resendOtp = async (name: string, email: string) => {
    try {
      console.log("Inside resendOtp UseCase with:", { name, email });
      const response = await sendOtp({email, name}) 
      return {message: response}
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  registerUser = async (
    name: string,
    email: string,
    password: string,
    phoneNumber: string,
    userImage: string,
    otp: string
  ) => {
    try {
      const storedOtp = await getOtpByEmail(email);
      if (storedOtp === null || storedOtp.toString() !== otp.toString()) {
        console.log("OTP does not match or is not found.");
        return { message: 'OTP does not match or is not found.' };
      }
  
      console.log("Received phoneNumber:", phoneNumber);
  
      const existingUser = (await userRepository.findByEmail(email)) as UserInterface;
      if (existingUser) {
        return { message: 'UserExist' };
      }
  
      const hashedPassword = await bcrypt.securePassword(password);
  
      const newUserData = {
        name,
        email,
        phoneNumber: phoneNumber,
        password: hashedPassword,
        userImage,
      };
  
      const response = await userRepository.saveUser(newUserData);
      
      if (response.message === 'UserCreated') {
        const newUser = (await userRepository.findByEmail(email)) as UserInterface;
        const token = await auth.createToken(newUser._id.toString(), '15m');
        const refreshToken = await auth.createToken(newUser._id.toString(), '7d');
  
        return {
          message: 'Success',
          name: newUser.name,
          token,
          _id: newUser._id,
          refreshToken,
          image: newUser.userImage,
        };
      } else {
        console.error("Error saving user:", response);
        return { message: 'UserNotCreated' };
      }
    } catch (error) {
      console.error("Error in registerUser:", error);
      return { message: (error as Error).message };
    }
  };
  
}
