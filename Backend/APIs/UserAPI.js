import exp from 'express'
import {hash,compare} from 'bcryptjs'
import bcrypt from 'bcryptjs'
import {UserModel} from '../models/UserModel.js'
import jwt from 'jsonwebtoken'
const {sign}=jwt
import { verifyToken } from '../middlewares/verifyToken.js'
import {config} from 'dotenv'
import {upload} from '../config/multer.js'
import {uploadToCloudinary } from '../config/cloudinaryUpload.js'

config()


export const userApp = exp.Router()

//Create New User
    userApp.post('/users',upload.single("profileImageUrl"),async(req,res,next)=>{
      let cloudinaryResult;
      try{
        //get new user obj from req
        const newUser=req.body
        console.log(newUser)
        //hash the password
        const hashedPassword=await hash(newUser.password,10)
        //replace original password with hashed password
        newUser.password=hashedPassword
        if(req.file){
          cloudinaryResult = await uploadToCloudinary(req.file.buffer)
          newUser.profileImageUrl = cloudinaryResult.secure_url;
        }
        //create new user document
        const NewUserDocument=new UserModel(newUser)
        //save
        let result=await NewUserDocument.save()
        //send response
        res.status(201).json({message:'User Created'})//it is mandatory to send status code
      }catch (err) {
    console.log("err is ", err);
    //delete image from cloudinary
    if (cloudinaryResult?.public_id) {
        console.log("cloudinary cleanup failed", cleanupErr.message);
      
    }
    next(err);
  }
    })
   

//user login
    userApp.post('/login',async(req,res)=>{
        //get user cred from req body
        const {email,password}=req.body
        //verify email
        const user=await UserModel.findOne({email:email})
        //if email doesnot exists
        if(!user){
            return res.status(400).json({message:'invalid email'})
        }
        //
         if (!user.isUserActive) {
        return res.status(403).json({
            message: "Account is deactivated. Contact support or reactivate."
        });
    }
        //valid password
        let result=await compare(password,user.password)
        //if password doesnot match
        if(result==false){
            return res.status(400).json({message:"invalid password"})
        }
        //if passwords matched
            //create token(jsonwebtoken-jwt)
            const signedToken=sign({userId:user._id,email:user.email,username:user.username,gender:user.gender},process.env.SECRET_KEY,{expiresIn:"1h"})//if time is give in "",then it is ms
            //store token as http only cookie 
            res.cookie("token",signedToken,{
                httpOnly:true,  //will store cookie in httpOnly
                sameSite:"lax",
                secure:false 
            })
            //send res  
            res.status(200).json({message:'login Success',payload: {
                                _id: user._id,
                                username: user.username,
                                email: user.email,
                                gender: user.gender,
                                profileImageUrl: user.profileImageUrl
                            }})
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


//Route to get user by username
userApp.get("/find-user", async(req,res)=>{
    try{
        //get username
    const {username}=req.body;
    //read user by username
    const user=await UserModel.findOne({username:username});

    //if user not found
    if(!user)
    {
        return res.status(404).json({ message: "user not found" })
    }
    //if user found send res
    res.status(200).json({
        message:"user found",
        payload:user
    })

    }catch(err) //if any error occurs
    {
        res.status(500).json({message:err.message})
    }

})

//delete user 
userApp.delete("/delete-user",verifyToken,async (req, res) => {
        //get user id from token
        const Id = req.user?.userId;
        
        //user document
        const UserDocument= await UserModel.findById(Id)
       
        //check if user exists
          if (!UserDocument) {
            return res.status(404).json({ message: "user not found" })
        }

        //check status
         if ( UserDocument.isUserActive === false) {
    return res.status(200).json({ message: "user already in the same state" });
  }
         await UserModel.findByIdAndUpdate(Id, {
      isUserActive: false
    });

    // logout user
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false
    });

    res.status(200).json({
      message: "Account deactivated successfully"
    });
})