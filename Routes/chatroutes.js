import express from "express"
import { addParticipants, checktoken, getAllChatsForUser, getSingleChat, leaveGroup, newGroupChat, removeParticipant, renameGroupChat } from "../functions/functionsForChat.js"


const router=express.Router()

router.get("/hello",async (req,res)=>{
    res.send("chat router working fine")
})
//endpoint = /chat/start/new/chat
router.post("/start/new/chat",async(req,res)=>{
await getSingleChat(req,res)
})
// endpoint= /chat/all/chats
router.get("/all/chats",async (req,res)=>{
    await getAllChatsForUser(req,res)
})
//endpoint=/chat/new/group/chat
router.post("/new/group/chat",async (req,res)=>{
    await newGroupChat(req,res)
})
//endpoint= /chat/rename/group/chat
router.put("/rename/group/chat",async(req,res)=>{
await renameGroupChat(req,res)
})
//endpoint = /chat/group/chat/add/user
router.put("/group/chat/add/user",async (req,res)=>{
    await addParticipants(req,res)
})
//endpoint = /chat/group/chat/remove/user
router.put("/group/chat/remove/user",async (req,res)=>{
    await removeParticipant(req,res)
})
router.get("/checktoken",async (req,res)=>{
    await checktoken(req,res)
})

//end point = /chat/leave/group/chat
router.put("/leave/group/chat",async (req,res)=>{
    await leaveGroup(req,res)
})







export const chatRouter=router