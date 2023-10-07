import mongoose from "mongoose";

const notificationModel = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: mongoose.Schema.Types.ObjectId,ref: "message" },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "chat" }
},
    {
        timestamps: true
    }
)

export const notification = mongoose.model("notification", notificationModel)