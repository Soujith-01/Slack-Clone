import {Schema,model,Types} from "mongoose"

const chatSchema=new Schema({
    type: {
        type: String,
        enum: ["channel", "dm"],
        required: true,
    },
    channelName:{
        type:String,
        requried:[true,"channel name is required"],
        unique:[true,"channel already Exists"],
    },
    members:[{
        type:Types.ObjectId,
        ref:"user"
    }],
    isChannelActive:{
        type:Boolean,
        default:true,
    },
    admin: { 
        type: Types.ObjectId, 
        ref: "user" 
    },
    latestMessage: {
        type: Types.ObjectId,
        ref: "message",
    },
},{
    timestamps:true,
    versionKey:false,
    strict:"throw"
});
//create model
export const chatModel=model("chat",chatSchema)