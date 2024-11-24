import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';


export default {
  createToken: async (
    clientId: ObjectId | string,
    role :string,
    expire: string
  ): Promise<string> => {
    try {
      const jwtSecretKey: string = process.env.USER_SECRET_KEY || 'Rezin';
      const payload = {
        clientId: clientId,
        role: role,
      };
      const token = jwt.sign(payload, jwtSecretKey, { expiresIn: expire });
      return token;
    } catch (error) {
      console.error(error);
      return 'Something went wrong';
    }
  },
};