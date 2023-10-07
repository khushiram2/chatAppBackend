import { isUserValid } from "../authentication/authent.js"
import { Chat } from "../models/chatmodel.js"
import { notification } from "../models/notificationModel.js"
import { User } from "../models/userModel.js"


export async function getAllNotification(req,res){

}


export async function postNewNotification(req,res){

try {
    const token=req.headers.authorization
    const validuser= await isUserValid(token)
  console.log(validuser)
    if(validuser){
        const {content,chatId}=req.body
        var newNotification={
            userId:validuser._id,
            content:content,
            chatId:chatId
        }
        const chatexist= await Chat.findOne({_id:chatId})
        var notification1=await notification.create(newNotification)
        notification1=await notification1.populate("userId","name picture")
        notification1=await notification1.populate("chatId")
        if(chatexist.isGroupChat){
         notification1= await  User.populate(notification1,{
            path:"chatId.groupAdmin",
            select:"name picture email"
         })
        }
        notification1=await User.populate(notification1,{
            path:"chatId.users",
            select:"name picture email"
        })

           console.log(notification1)
  res.status(200).send(notification1)
          

    }else{
        throw new Error("token expired")
    }
} catch (error) {
    console.log(error)
    res.status(400).send("error occured try agin")
}
}