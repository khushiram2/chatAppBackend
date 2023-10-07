import jwt  from "jsonwebtoken";

export const generateToken=(id)=>{
return  jwt.sign({id},process.env.secretKey,{expiresIn:"1d"})
}