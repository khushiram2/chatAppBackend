import express from "express"
import { getAllMessagesFromChat, sendMessage } from "../functions/functionsformessage.js"

const router=express.Router()

//endpoint = /message
router.get("/",(req,res)=>{
    res.send("message route working")
})
//endpoint = /message/send
router.post("/send",async(req,res)=>{
await sendMessage(req,res)
})
//endpoint = /message/all/:chatId
router.get("/all/:chatId",async(req,res)=>{
    await getAllMessagesFromChat(req,res)

})




export const messageRouter=router