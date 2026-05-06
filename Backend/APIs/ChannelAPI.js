import exp from 'express'
import { chatModel } from "../models/ChatModel.js";
import { verifyToken } from '../middlewares/verifyToken.js';
import { UserModel } from '../models/UserModel.js';
import { Types } from 'mongoose';
import { userApp } from './UserAPI.js';

export const chatApp=exp.Router()

//create new channel
chatApp.post('/chats/channel',verifyToken,async(req,res)=>{
    //get channel details from req body
    const {type,channelName,members} = req.body;
    //check channel
    if(!channelName){
       return res.status(400).json({message:"channel name is required"})
    }
    //if no members are given
    if(members.length===0){
        return res.status(400).json({message:"minimum 1 members is required to create a channel"})
    }

    const adminId=req.user.id
    //create channel
    const newChannel=await chatModel.create({
        channelName,
        type,
        members:[...members,adminId],
        admin:adminId
    })
    //send res
    res.status(200).json({message:"channel successfully created",payload:newChannel})
    
})

//create new dm
chatApp.post('/chats/dm',verifyToken,async(req,res)=>{
    //logged in userId
    const userId=req.user.userId;
    //other userId to create a DM
    const newUser=req.body.members;
    //check the newUser is existed or not
    const existingUser=await UserModel.findById(newUser)
    //check user
    if(!existingUser){
        return res.status(400).json({message:"user not existed"})
    }
    //check id dm is created with same user
    if(userId.toString()===newUser){
        return res.status(400).json({message:"cannot create dm for current user"})
    }
    //members to create dm
    const members=[userId.toString(),newUser]
    //check if dm already exists
    const existingDm=await chatModel.findOne({
        type:"dm",
        members: { $all: members, $size: 2 }
    })
    //check dm already exists or not
    if(existingDm){
        return res.status(400).json({message:"dm already exists",payload:existingDm})
    }
    //create new dm
    const newDm=await chatModel.create({
        type:'dm',
        members
    })
    //send res
    res.status(400).json({message:"dm created successfully",payload:newDm})
})

//get all chats
chatApp.get('/chats',verifyToken,async(req,res)=>{
    //get logged in userId
    const userId = req.user.id
    //get all chats 
    const chats = await chatModel.find({members:userId})
    //send res
    res.status(200).json({message:"chats",payload:chats})
})

//get chgannel by channelId
chatApp.get('/channels',verifyToken,async(req,res)=>{
    //get channelName from req
    const { channelName } = req.body
    //get channel
    const channel=await chatModel.findOne({type:"channel",channelName:channelName})
    //check if channel exists
    if(!channel){
        return res.status(400).json({messgae:"channel not found"})
    }
    //send res
    res.status(200).json({payload:channel})
})

//update channel name
chatApp.patch('/channel',verifyToken,async(req,res)=>{
    //get old and new channel names from req
    const {oldName,newName} = req.body
    //logged in user
    const user=req.user.id
    //find channel by oldName
    const channel=await chatModel.findOne({channelName:oldName})
    //check if admin of channel is logged in or not
    if(user!=channel.admin){
        return res.status(403).json({message:"only admin can change the channel name"})
    }
    //change channel name
    const updatedChannel = await chatModel.findOneAndUpdate({channelName:oldName},{$set:{channelName:newName}},{new:true})
    //send res
    res.status(200).json({message:"channel name upddated",payload:updatedChannel})
})


//delete channel
chatApp.delete('/delete',verifyToken,async(req,res)=>{
    //get channel name from req body
    const {channelName} = req.body
    //get logged in user
    const userId = req.user.id
    //find channel
    const channel = await chatModel.findOne({channelName:channelName})
    //check logged in user and admin of the channel is same or not
    if(userId!=channel.admin){
        return res.status(403).json({message:"only admin can delete the channel"})
    }
    //delete channel
    const deletedChannel = await chatModel.findOneAndDelete({channelName:channelName})
    //send res
    res.status(200).json({message:"channel deleted"})
})


//add members to channel
chatApp.put('/add-members',verifyToken,async(req,res)=>{
    //get channel details from req body
    const {channelName,members} = req.body
    //admin
    const adminId = req.user.id
    //check members 
    if(!members || members.lenght===0){
        return res.status(400).json({message:"atleast one members should be added"})
    }
    // validate member ids
    const validMembers = members.filter(id =>
      Types.ObjectId.isValid(id)
    );

    if (validMembers.length !== members.length) {
      return res.status(400).json({ message: "Invalid member IDs present" });
    }
    //check if channel is present or not 
    const channel = await chatModel.findOne({channelName:channelName})
    if(!channel){
        return res.status(404).json({message:"channel not found"})
    }
    //check type
    if(channel.type==="dm"){
        return res.status(400).json({message:"cannot add members to dm"})
    }
    //check admin is adding or not
    if(channel.admin!=adminId){
        return res.status(403).json({message:"only admin can add members"})
    }
    //add members 
    const updatedChannel = await chatModel.findOneAndUpdate({channelName:channelName,},
        {$addToSet:{members:{$each:members}}},
        {new:true}
    )
    //send res
    res.status(200).json({message:"members added successfully",payload:updatedChannel})
})


//delete members from channel
chatApp.delete('/delete-members',verifyToken,async(req,res)=>{
    //get channelName and members from the req body
    const {channelName,member} = req.body
    //logged in user id
    const userId = req.user.id
    //check members array 
    if(member.length===0){
        return res.status(400).json({message:"userIds are required"})
    }
    //find channel
    const channel = await chatModel.findOne({channelName})
    console.log(channel)
    //if channel not found
    if(!channel){
        return res.status(400).json({message:"channel not found"})
    }
    //check if it is a dm
    if(channel.type==="dm"){
        return res.status(400).json({messgae:"cannot delete members from dm"})
    }
    //only admin can remove users
    if(channel.admin.toString()!=userId.toString()){
        return res.status(403).json({messgae:"you are not an admin"})
    }
    //admin cannot be removed
    if(member===userId){
        return res.status(400).json({message:"admin cannot be removed"})
    }
    //check all users are found or not
    const isMember = channel.members
    .map(id => id.toString())
    .includes(member);
    //if user not found
    if (!isMember) {
        return res.status(400).json({message: "User not in channel"});
    }
    //remove users
     const updatedChannel = await chatModel.findOneAndUpdate(
      {channelName},
      {
        $pull: {
            members: member
        }
      },
      { new: true }
    )
    //send res
    res.status(200).json({messgae:"user removed",payload:updatedChannel})
})

//route to get all members from a channel
chatApp.get('/members',verifyToken,async(req,res)=>{
    //get channel name from req body
    const {channelName} = req.body
    //find channel
    const channel = await chatModel.findOne({channelName}).populate("members","username email")
    //if channel not found
    if(!channel){
        return res.status(400).json({message:"channel not found"})
    }
    //if the channel is dm
    if(channel.type==="dm"){
        return res.status(400).json({message:"it is a dm chat"})
    }
    //send res
    res.status(200).json({message:"members",payload:channel.members})
})