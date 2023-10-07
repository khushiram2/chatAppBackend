import mongoose from "mongoose";

const messageModel = mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "chat" }
},
    {
        timestamps: true
    }
)

export const message = mongoose.model("message", messageModel)