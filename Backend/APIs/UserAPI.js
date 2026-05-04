import exp from 'express'
import {hash,compare} from 'bcryptjs'
import {UserModel} from '../models/UserModel.js'
import jwt from 'jsonwebtoken'
const {sign}=jwt
import { verifyToken } from '../middlewares/verifyToken.js'
import {config} from 'dotenv'

config()

export const userApp = exp.Router()

//Create New User
    userApp.post('/users',async(req,res)=>{
        //get new user obj from req
        const newUser=req.body
        //hash the password
        const hashedPassword=await hash(newUser.password,10)
        //replace original password with hashed password
        newUser.password=hashedPassword
        //create new user document
        const NewUserDocument=new UserModel(newUser)
        //save
        let result=await NewUserDocument.save()
        //send response
        res.status(201).json({message:'User Created'})//it is mandatory to send status code
    })
   

//user login
    userApp.post('/auth',async(req,res)=>{
        //get user cred from req body
        const {email,password}=req.body
        //verify email
        const user=await UserModel.findOne({email:email})
        //if email doesnot exists
        if(!user){
            return res.status(400).json({message:'invalid email'})
        }
        //valid password
        let result=await compare(password,user.password)
        //if password doesnot match
        if(result==false){
            return res.status(400).json({message:"invalid password"})
        }
        //if passwords matched
            //create token(jsonwebtoken-jwt)
            const signedToken=sign({email:user.email,password:user.password,username:user.username,gender:user.gender},process.env.SECRET_KEY,{expiresIn:"1h"})//if time is give in "",then it is ms
            //store token as http only cookie 
            res.cookie("token",signedToken,{
                httpOnly:true,  //will store cookie in httpOnly
                sameSite:"lax",
                secure:false 
            })
            //send res
            res.status(200).json({message:'login Success'})
    })

//Route for Logout
userApp.get("/logout", (req, res) => {
  //delete token from cookie storage
  res.clearCookie("token", {
    httpOnly:true,
    sameSite:"lax",
    secure:false
  });
  //send res
  res.status(200).json({ message: "Logout success" });
});

