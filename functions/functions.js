import { ObjectId } from "mongodb";
import { isUserValid } from "../authentication/authent.js";
import { generateToken } from "../authentication/tokens.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";

export const registerNewUser = async (req, res) => {
  const { name, email, password } = req.body.user;
    
  const userexist = await User.findOne({ email: email });
  if (userexist) {
    res.status(206).send({ message: "user already exist" });
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const register = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    if (register) {
        const token= await generateToken(register._id)
      res.status(200).send({message:"user registered sucessfully",token:token,data:{id:register._id,name:register.name,email:register.email,picture:register.picture}});
    }else{
        res.status(205).send("some problem occured while registering new user")
    }
  }
};

export const logIn=async(req,res)=>{
  const {email,password}=req.body.user;
  const userexist= await User.findOne({email:email})
  if(userexist){
    const passwordMatch= await bcrypt.compare(password,userexist.password)
    if(passwordMatch){
      const token= generateToken(userexist._id)
      res.status(200).json({message:"logged in sucessfully",token:token,data:{id:userexist._id,name:userexist.name,email:userexist.email,picture:userexist.picture}})
    }else{
      res.status(206).send("invalid credentials")
    }
  }else{
    res.status(205).send("invalid credentials")
  }

}


export const getAllUser=async(req,res)=>{
  try {
    const token=req.headers.authorization
    const user=await isUserValid(token)
    
    if(user){
      const id=new ObjectId(user._id)
      const {name}=req.query;
      let users;
      if(name){
        users= await User.find({$or:[
          {name:{$regex:name,$options:"i"}}, // i is for case insensitive don't forget it
          {email:{$regex:name,$options:"i"}}
        ],_id:{$ne:id}},{password:0})
      }else{
        users =await User.find({_id:{$ne:new ObjectId(user._id)}})
      }
      res.status(200).send(users)
    }else{
      res.status(206).send("user is not valid")
    }

  } catch (error) {
    console.log(error)
    res.status(206).send({error:error,message:"error occured while getting users"})
  }

}
