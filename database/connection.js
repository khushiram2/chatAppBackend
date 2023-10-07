import mongoose from "mongoose";

export const dbconnection=async()=>{
    try {
        const client=await mongoose.connect(process.env.Url,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log("mongodb connected via mongoose")
    } catch (error) {
        console.log(error)
    }
}