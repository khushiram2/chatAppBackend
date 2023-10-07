import { isUserValid } from "../authentication/authent.js"
import { Chat } from "../models/chatmodel.js"
import { message } from "../models/messageModel.js"
import { User } from "../models/userModel.js"

export const sendMessage=async(req,res)=>{
try {
    const token=req.headers.authorization
    const validuser= await isUserValid(token)
    const checkIfChatisGroupChat=async(id)=>{
        const groupChat= await Chat.findOne({_id:id})
        if(groupChat){
            return {status:true,groupchat:groupChat}
        }else{
            return {status:false}
        }
    }
    if(validuser){
        const {content,chatId}=req.body
        var newMessage={
            sender:validuser._id,
            content:content,
            chat:chatId
        }
        
        const chatStatus= await checkIfChatisGroupChat(chatId)
        var message1=await message.create(newMessage)
        message1=await message1.populate("sender","name picture")
        message1=await message1.populate("chat")
        if(chatStatus.status){
         message1= await  User.populate(message1,{
            path:"chat.groupAdmin",
            select:"name picture email"
         })
        }
        message1=await User.populate(message1,{
            path:"chat.users",
            select:"name picture email"
        })

           
            await Chat.updateOne({_id:chatId},{$set:{latestMessage:message1}})
  res.status(200).send(message1)
          

    }else{
        throw new Error("token expired")
    }
} catch (error) {
    console.log(error)
    res.status(400).send("error occured try agin")
}
}


export const getAllMessagesFromChat=async(req,res)=>{
    try {
        const token=req.headers.authorization
        const validuser= await isUserValid(token)
        if(validuser){
            const {chatId}=req.params
            const requestedChat=await message.find({chat:chatId}).populate("sender", "name picture email")
            .populate("chat")
            // const populatedChat=await Chat.populate(requestedChat,{
            //     path:"chat.groupAdmin",
            //     select:"name picture email"
            // })
            res.status(200).send(requestedChat)

        }else{
            throw new Error("token not valid")
        }
        
    } catch (error) {
        console.log(error)
        res.status(400).send("some error occured")
    }

}