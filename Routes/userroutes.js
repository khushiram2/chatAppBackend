import express from "express"
import { getAllUser, logIn, registerNewUser } from "../functions/functions.js"

const router=express.Router()
// endpoint = /user/register
router.post("/register",async(req,res)=>{
     await  registerNewUser(req,res) 
    
})
// endpoint = /user/login
router.post("/login",async(req,res)=>{
  await  logIn(req,res) 
 
})
// endpoint = /user/getallusers OR /user/getallusers?name=`name of user`
router.get("/getallusers",async(req,res)=>{
    await getAllUser(req,res)
})




export const userRouter=router