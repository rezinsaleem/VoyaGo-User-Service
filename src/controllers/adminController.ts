import { ObjectId } from 'mongodb';
import auth from '../middleware/auth';

export default class AdminController {
  adminLogin = async (
    call: { request: { email: string; password: string } },
    callback: (error: any, response: any) => void
  ) => {
    try {
      const { email, password } = call.request;
      console.log(call.request);
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin@123';
      if (email === adminEmail && password === adminPassword) {
        const token = await auth.createToken(new ObjectId(), 'admin','3d');
        callback(null, {
          message: 'Success',
          name: adminEmail,
          token,
        });
      } else {
        callback(null, { message: 'Invalid Credentials' });
      }
    } catch (error) {
      console.error(error);
      callback(null, { error: 'Something went wrong' });
    }
  };
}