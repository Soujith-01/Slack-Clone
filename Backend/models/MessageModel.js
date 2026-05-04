import {Schema, Types, model} from 'mongoose'

const reactionSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'user',
        required: [true, "User id is requred"]
    },
    reaction: {
        type: String,
    } 
},
{
    _id: false ,
    versionKey: false,
    timestamps: true,
    strict: 'throw'
})

const attachmentSchema = new Schema(
{
  url: String,
  type: String, // image, video, file
  name: String,
},
{ _id: false }
)

// create message model
const messageSchema = new Schema({
    senderID: {
        type: Types.ObjectId,
        ref: "user",
        required: [true,"Author ID is required"]
    },

    chatType: {
        type: String,
        enum: ["channel", "dm"],
        required: true,
    },

    content: {
        type: String,
    },

    channel: {
        type: Types.ObjectId,
        ref: "channel",
        required: true
    },

    reactions: [{type: reactionSchema , default: []}],

    attachments: [{type: attachmentSchema, default: []}],

    parentMessage:{
        type: Types.ObjectId,
        ref: "message",
        default: null
    },
    
    status: {
        type: String,
        enum: ["sent","delivered","seen"],
        default: "sent"
    },

    isEdited: {
        type: Boolean,
        default: false
    }
},{
    versionKey: false,
    timestamps: true,
    strict: 'throw'
})

export const messageModel = model("message", messageSchema);