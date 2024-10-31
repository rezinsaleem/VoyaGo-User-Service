import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import 'dotenv/config';
import connectDB from './config/mongo';

import RegisterController from './controllers/registerController';
import LoginController from './controllers/loginController';
import AdminController from './controllers/adminController';
import UserController from './controllers/userController';



const loginController = new LoginController();
const registerController = new RegisterController();
const adminController = new AdminController();
const userController = new UserController();

connectDB()

const PROTO_PATH = path.resolve(__dirname, './proto/user.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDef) as any;

if (
  !grpcObject.user ||
  !grpcObject.user.User ||
  !grpcObject.user.User.service
) {
  console.error('Failed to load the User service from the proto file.');
  process.exit(1);
}

const server = new grpc.Server();

server.addService(grpcObject.user.User.service, {
  
  SignupOtp:registerController.signupOtp,
  ResendOtp: registerController.resendOtp,
  RegisterUser: registerController.registerUser,
  IsBlocked: userController.isBlocked,

  LoginUser: loginController.loginUser,
  GoogleLoginUser: loginController.googleLoginUser,
  ForgotPassOtp: loginController.forgotPassOtp,
  OtpVerify: loginController.otpVerify,
  UpdatePassword: loginController.updatePassword,
   
  UpdateUser: userController.updateUser,
  ChangePassword: userController.changePassword,

  AdminLogin: adminController.adminLogin,
  GetUsers: userController.getUsers,
  GetUser: userController.getUser,
  BlockUser: userController.blockUser,
  VerifyUser: userController.verifyUser,
  UserVerification: userController.userVerification,
  
});

const SERVER_ADDRESS = process.env.GRPC_SERVER_PORT || '50001';
const Domain =
  process.env.NODE_ENV === 'dev'
    ? process.env.DEV_DOMAIN
    : process.env.PRO_DOMAIN_USER;
console.log(Domain);

server.bindAsync(
  `${Domain}:${SERVER_ADDRESS}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error(`Failed to bind server: ${err}`);
      return;
    }
    console.log(`gRPC server running at ${port}`);
  }
);