import {Schema,model,Types} from "mongoose"

const channelSchema=new Schema({
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
        type:String,
        default:true,
    },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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
export const channelModel=model("channel",channelSchema)