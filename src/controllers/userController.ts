
import UserUseCase from "../useCases/userUseCase";
import { UpdateUserRequest } from "../utilities/interface";


const userUseCase = new UserUseCase()

export default class UserController {
  

  updateUser = async (
    call: {
      request: UpdateUserRequest;
    },
    callback: (error: any, response: any) => void
  ) => {
    console.log(call.request);
    const { id, name, phoneNumber, userImage } = call.request;
    const updates: Partial<UpdateUserRequest> = {};
    if (name) {
      updates.name = name;
    }
    if (phoneNumber) {
      updates.phoneNumber = phoneNumber;
    }
    if (userImage) {
      updates.userImage = userImage; 
    }
    try {
      const response = await userUseCase.updateUser(id, updates);
      callback(null, response);
    } catch (error) {
      console.error('Update user failed:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  changePassword = async (
    call: {
      request: {
        id: string;
        currentPassword: string;
        newPassword: string;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    try {
      const { id, currentPassword, newPassword } = call.request;
      const response = await userUseCase.changePassword(id, currentPassword, newPassword);
      callback(null, response);
    } catch (error) {
      console.error('Error fetching services:', error);
      callback(null, { error: (error as Error).message });
    }
  };

}
