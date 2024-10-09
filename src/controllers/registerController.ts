import RegisterUseCase from "../useCases/registerUseCase";

const registerUseCase = new RegisterUseCase()

export default class RegisterController {

    signupOtp = async (
      call: { request: {name: string, email: string;} },
      callback: (error: any, response: any) => void
    ) => {
      const { name, email } = call.request;
        try {
          const response = await registerUseCase.signupOtp(name, email);
          callback(null, response);
        } catch (error) {
          console.error('Otp sending failed:', error);
          callback(null, { error: (error as Error).message });
        }
    }

    resendOtp = async (
      call: { request: { name: string; email: string; } },
      callback: (error: any, response: any) => void
  ) => {
      console.log("Entering resendOtp method in UserService");
      console.log("Received request:", call.request);
      const { name, email } = call.request;
      try {
          console.log('Attempting to resend OTP for:', { name, email });
          const response = await registerUseCase.resendOtp(name, email);
          console.log('OTP resend response:', response);
          callback(null, response);
      } catch (error) {
          console.error('Otp sending failed:', error);
          callback(null, { error: (error as Error).message });
      }
  };


  registerUser = async (
    call: { request: {name: string, email: string; phoneNumber: string, password: string, userImage: string ,otp: string} },
    callback: (error: any, response: any) => void
  ) => {
    console.log(call.request)
    const { name, email, password, phoneNumber, userImage, otp} = call.request;
    
    try {
      const response = await registerUseCase.registerUser(name, email, password, phoneNumber, userImage, otp);
      callback(null, response);
    } catch (error) {
      console.error('Signup failed:', error);
      callback(null, { error: (error as Error).message });
    }
  };
  
  }