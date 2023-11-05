import jwt from "jsonwebtoken"
import { User } from "../models/userModel.js"
import { ObjectId } from "mongodb"




export const isUserValid = async (token) => {
    try {
      const decodedToken = await jwt.verify(token, process.env.secretKey);
      if (decodedToken) {
        const user = await User.findOne({ _id: new ObjectId(decodedToken.id) });
        return user;
      } else {
        throw new Error('Token is invalid');
      }
    } catch (err) {
      throw err;
    }
  };
  