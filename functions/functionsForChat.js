import { ObjectId } from "mongodb";
import { isUserValid } from "../authentication/authent.js";
import { Chat } from "../models/chatmodel.js";
import { User } from "../models/userModel.js";

export const getAllChatsForUser = async (req, res) => {
  try {
    const  token  = req.headers.authorization;
    const user = await isUserValid(token);
    if (user) {
      await Chat
        .find(
{            $or : [
                { users: { $elemMatch: { $eq: user._id } } },
                { groupAdmin:  { $eq: user._id }  },
              ]})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (result) => {
          result = await User.populate(result, {
            path: "latestMessage.sender",
            select: "name pic email",
          });
          res.status(200).send(result);
        });
    } else {
      res.status(206).send("some error occured while authenticating the user");
    }
  } catch (error) {
    console.log(error);
    res.status(206).send("some error occured while getting all chats");
  }
};

export const newGroupChat = async (req, res) => {
  const  token  = req.headers.authorization;
  const { users, groupName } = req.body;
  const user = await isUserValid(token);
  if (user) {
    if (users && groupName) {
      if (users.length > 1) {
        try {
          const groupChat = await Chat.create({
            chatName: groupName,
            users: users,
            isGroupChat: true,
            groupAdmin: user._id,
          });

          const fullGroupChat = await Chat
            .findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
          res.status(200).send(fullGroupChat);
        } catch (error) {
          res.status(206).send("some error occured");
        }
      } else {
        res
          .status(206)
          .send("users should be more than 2 to form a group chat");
      }
    } else {
      res.status(206).send("please fill all the fields");
    }
  } else {
    res.status(206).send("not a valid user");
  }
};

export const renameGroupChat = async (req, res) => {

  try {
    const token=req.headers.authorization;
    const user=await isUserValid(token)
    if(user){
        const {chatId,newChatName}=req.body;
        const editedName= await Chat.findOneAndUpdate({_id:chatId},{$set:{chatName:newChatName}})
        const afterEditing= await Chat.findOne({_id:chatId}).populate("users", "-password")
        .populate("groupAdmin", "-password")
        if(editedName.chatName!==afterEditing.chatName){
            res.status(200).send(afterEditing)
        }else{
            throw new Error("can not change chat name")
        }


    }else{
        throw new Error("invalid user")
    }
  } catch (error) {
    console.log(error)
    res.status(500).send("something went wrong please try again")
  }
};

export const removeParticipant = async (req, res) => {
    try {
        const token=req.headers.authorization
        const user=await isUserValid(token)
        if(user){
           const {userId,chatId}=req.body;
           const UserRemoved= await Chat.findOneAndUpdate({_id:chatId},{$pull:{users:userId}},{new:true}).populate("users", "-password")
           .populate("groupAdmin", "-password")
           res.status(200).send(UserRemoved)
        }else{
            res.status(206).send("invalid user")
        }
      } catch (error) {
        console.log(error)
        res.status(500).send("some error occured ")
      }
};
export const leaveGroup=async(req,res)=>{
    try {
        const token=req.headers.authorization
        const user=await isUserValid(token)
        if(user){
           const {chatId}=req.body;
           const findchat= await Chat.findOne({_id:chatId}).populate("users", "-password")
           .populate("groupAdmin", "-password")
           const admin=findchat.groupAdmin
           if(admin!==null && String( new ObjectId(user._id)) ===String( new ObjectId(admin._id) )){
            const adminRemoved= await Chat.findOneAndUpdate({_id:chatId},{$set:{groupAdmin:null}})
            if(adminRemoved){
                res.status(200).send("you left the chat")
            }else{
                throw new Error("could not leave the chat try again")
            }
           }else{
            const UserRemoved= await Chat.findOneAndUpdate({_id:chatId}, { $pull: { users: { $elemMatch: { $eq: user._id } } } })
            if(UserRemoved){
                res.status(200).send("you left the chat")
            }else{
                throw new Error("could not leave the chat try again")
            }
 
           }
           
        }else{
            res.status(206).send("invalid user")
        }
      } catch (error) {
        console.log(error)
        res.status(500).send("some error occured ")
      }
}

export const addParticipants = async (req, res) => {
  try {
    const token=req.headers.authorization
    const user=await isUserValid(token)
    if(user){
       const {userId,chatId}=req.body;
       const newUserAdded= await Chat.findOneAndUpdate({_id:chatId},{$push:{users:userId}},{new:true}).populate("users", "-password")
       .populate("groupAdmin", "-password")
       res.status(200).send(newUserAdded)
    }else{
        res.status(206).send("invalid user")
    }
  } catch (error) {
    console.log(error)
    res.status(500).send("some error occured ")
  }
};

// get a single chat or create new chat if the chat does not exist
export const getSingleChat = async (req, res) => {
  const  token  = req.headers.authorization;
  const user = await isUserValid(token);
  const userId = user._id;
  const secondUser = await User.findOne({ _id: req.body.id });

  var chatPresent = Chat
    .findOne({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: secondUser._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
    .populate("users", "-password")
    .populate("latestMessage");

  chatPresent = await User.populate(chatPresent, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  // const chatPresent = await chat.aggregate([
  //     {
  //       $match: {
  //         isGroupChat: false,
  //         users: {
  //           $all: [secondUser._id, userId]
  //         }
  //       }
  //     },
  //     {
  //       $lookup: {
  //         from: 'users',
  //         localField: 'users',
  //         foreignField: '_id',
  //         as: 'userObjects'
  //       }
  //     },
  //     {
  //       $lookup: {
  //         from: 'messages',
  //         localField: 'latestMessage',
  //         foreignField: '_id',
  //         as: 'latestMessageObject'
  //       }
  //     },
  //     {
  //       $lookup: {
  //         from: 'users',
  //         localField: 'latestMessageObject.sender',
  //         foreignField: '_id',
  //         as: 'latestMessageObject.sender'
  //       }
  //     },
  //     {
  //       $project: {
  //         userObjects: {
  //           _id: 1,
  //           name: 1,
  //           pic: 1,
  //           email: 1
  //         },
  //         latestMessageObject: 1,
  //       }
  //     }
  //   ]);

  if (chatPresent) {
    res.status(200).send(chatPresent);
  } else {
    var newChat = {
      chatName: `${user.name} and ${secondUser.name}`,
      isGroupChat: false,
      users: [secondUser._id, userId],
    };

    try {
      const createNewChat = await Chat.create(newChat);
      const fullChat = await Chat
        .findOne({ _id: createNewChat._id })
        .populate("users", "-password");
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(206).send(error);
    }
  }
};

export const checktoken=async(req,res)=>{
    try {
        const  token  = req.headers.authorization;
         await isUserValid(token);
        res.status(200).send("user is valid")
    } catch (error) {
        console.log(error)
        res.status(208).send("token invalid")
    }


} 