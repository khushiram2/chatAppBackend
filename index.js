import express from "express"
import dotenv from "dotenv";
import cors from "cors"
import { dbconnection } from "./database/connection.js";
import { userRouter } from "./Routes/userroutes.js";
import { chatRouter } from "./Routes/chatroutes.js";
import { messageRouter } from "./Routes/messageroutes.js";
import { Server } from "socket.io";
import { notificationRouter } from "./Routes/notiifiationRoutes.js";
dotenv.config()

await dbconnection()

const app = express()
app.use(express.json())
app.use(cors())
app.get("/", async (req, res) => {
    res.status(200).send("app started")
})
app.use('/user', userRouter)
app.use('/chat', chatRouter)
app.use('/message', messageRouter)
app.use("/notification",notificationRouter)



const server = app.listen(4000, () => console.log("app started on port 4000"))
const io = new Server(server, {
    pingTimeout: 600000,
    cors: {
        origin: "*"
    }
})

io.on("connection", (socket) => {
    console.log("connected to socket.io")
    socket.on("setup", (userData) => {

        socket.join(userData.id)
        socket.emit("connected")
    })

    socket.on("join-chat", (room) => {
        socket.join(room)
        console.log("user joined room no." + room);
    })
    socket.on("typing",(room)=>{
        console.log("triggered");
        socket.to(room).emit("typing")
    })
    socket.on("stoptyping",(room)=>{
        console.log("stopped typing")
        socket.to(room).emit("stoptyping")})

    socket.on("send-message",(newMessage)=>{
        const parsedmessage=JSON.parse(newMessage)
        const chat=parsedmessage.chat
        if(!chat.users) return console.log("users not defined");   
    
          socket.in(chat._id).emit("message-recieved",parsedmessage)    
        
    })

    socket.on("user-disconnected",(room)=>{
        console.log("user disconnected from" + room)
        socket.leave(room)
    })


    socket.on('logout', () => {
        console.log('User logged out');
        socket.disconnect();
      });
    
})
io.on('error', (error) => {
    console.error('Socket.IO Error:', error);
});