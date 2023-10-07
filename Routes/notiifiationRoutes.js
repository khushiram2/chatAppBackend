import express from "express"
import { postNewNotification } from "../functions/functionNotification.js"


const router = express.Router()

router.get("/",async (req,res)=>{
        res.send("notification router working fine")
})

//endpoint /notification/post
router.post("/post" ,async (req,res)=>{
     postNewNotification(req,res)
})








export const notificationRouter=router