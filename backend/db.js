import mongoose from "mongoose";

export const connectDB = async()=>{
    try{
        await mongoose.connect(`mongodb://127.0.0.1:27017/workout`)
        console.log("DB conected")
    }catch(e){
        console.error(e)
        process.exit(1)
    }
}