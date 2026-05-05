import exp from 'express'
import {hash,compare} from 'bcryptjs'
import bcrypt from 'bcryptjs'
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






//update user by username

// UPDATE USER (using JWT → req.user.username)
userApp.put("/users", verifyToken, async (req, res) => {
  try {
    const oldUsername = req.user.username; // 🔥 from token

    const { username, email, password, gender, profileImage } = req.body;

    const updates = {};

    //  Get current user first
    const currentUser = await UserModel.findOne({ username: oldUsername });

    if (!currentUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    //  USERNAME
    if (username) {
      const userExists = await UserModel.findOne({ username });

      if (userExists && userExists._id.toString() !== currentUser._id.toString()) {
        return res.status(400).json({ msg: "Username already exists" });
      }

      updates.username = username.trim();
    }

    //  EMAIL
    if (email) {
      const emailLower = email.toLowerCase();

      const emailExists = await UserModel.findOne({ email: emailLower });

      if (emailExists && emailExists._id.toString() !== currentUser._id.toString()) {
        return res.status(400).json({ msg: "Email already exists" });
      }

      updates.email = emailLower.trim();
    }

    //  PASSWORD
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    //  GENDER
    if (gender) {
      updates.gender = gender; // MALE/FEMALE/OTHERS
    }

    //  PROFILE IMAGE
    if (profileImage) {
      updates.profileImage = profileImage;
    }

    //  UPDATE USER
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: currentUser._id },
      { $set: updates },
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    res.status(200).json({
      msg: "User updated successfully",
      user: updatedUser
    });

  } catch (err) {
    console.log(err);

    // 🔥 Duplicate key fallback (11000)
    if (err.code === 11000) {
      return res.status(400).json({
        msg: "Duplicate value error",
        field: err.keyValue ? Object.keys(err.keyValue)[0] : "unknown"
      });
    }

    res.status(500).json({ error: err.message });
  }
});


