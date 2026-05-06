import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
const {verify} = jwt
config()

export function verifyToken(req,res,next){
    //token verification logic
    const token=req.cookies?.token
    //if req from unauthorized user
    if(!token){
        return res.status(401).json({message:'please login'})
    }
    try{
    //if token valid
    const decodedtoken=verify(token,process.env.SECRET_KEY)//returns error if token is invalid
    //console.log(decodedtoken)
    //attach encoded user to req
    //if decodedToken is not attached the request wont be able to know who sent the request
    req.user=decodedtoken
    next()
    }catch(err){
        res.status(401).json({message:'session expired. login again'})
    }
}