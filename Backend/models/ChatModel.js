import {Schema,model,Types} from "mongoose"

const chatSchema=new Schema({
    type: {
        type: String,
        enum: ["channel", "dm"],
        required: true,
    },
    channelName: {
        type: String,
        required: function () {
            return this.type === "channel";
        },
        unique: true,
        sparse: true
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