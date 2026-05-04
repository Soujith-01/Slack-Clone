import exp from 'express'
import {connect} from 'mongoose'
import { config } from 'dotenv'
import { createServer } from 'node:http'
import { Server } from "socket.io";


const app=exp()
const server=createServer(app)
const io = new Server(server);
config()

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const connectDB = async()=>{
    try{
        await connect(process.env.DB_URL)
        console.log('DB connected ')
        const port=process.env.PORT || 4000;
        server.listen(port,()=>console.log(`server listening in ${port}`))
    }catch(error){
        console.log("error in connecting",error.message)
    }
}

connectDB()


app.use((err,req,res,next)=>{
    console.log(err)
    //ValidationError
    if(err.name=="ValidationError"){
        return res.status(400).json({message:"Error occured",error:err})
    }

    //CastError
    if(err.name=="CastError"){
        return res.status(400).json({message:"Error occured",error:err})
    }

    //server side error
    res.status(500).json({message:"error occured",error:err.message})
})


