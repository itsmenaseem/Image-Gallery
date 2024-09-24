import mongoose from "mongoose";


export default  async function connectToDb(){
    try {
        await mongoose.connect(process.env.MONGO_URI!)
        .then(()=>{
            console.log("Connected to database");
            
        })
    } catch (error:unknown) {
        console.log("Error connecting to database",error);
        
    }
}