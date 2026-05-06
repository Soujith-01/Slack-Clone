import exp from 'express'
import {connect} from 'mongoose'
import { config } from 'dotenv'
import { createServer } from 'node:http'
import { Server } from "socket.io";
import { userApp } from './APIs/UserAPI.js';
import { chatApp } from './APIs/channelAPI.js';
import cookieParser from 'cookie-parser'
import jwt from "jsonwebtoken"
import { setupSocket } from "./sockets/socket.js";
import { messageApp } from "./APIs/MessageAPI.js";
import {fileTransferApp } from "./APIs/FileTransferAPI.js"



const app=exp()
const server=createServer(app)

config()

//body parser middleware
app.use(exp.json())

//cookie parser
app.use(cookieParser())

//forward to userapi if path starts with /user-api
app.use('/user-api',userApp)
app.use('/chat-api',chatApp)
app.use("/message-api", messageApp);
app.use("/fileTranser-api",fileTransferApp)

//socket server
const io = new Server(server, {
  cors: {
    origin: "*",
     methods: ["GET", "POST"],
  }
});

setupSocket(io);

const connectDB = async()=>{
    try{
        await connect(process.env.DB_URL)
        console.log('DB connected ')
        const port=process.env.PORT || 3000;
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


