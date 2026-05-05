import {Schema, Types, model} from 'mongoose'

// create message model
const messageSchema = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    content: {
        type: String,
        trim: true,
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "channel",
    },
    // Threads
    parentMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "message",
        default: null,
    },
    // Reactions
    reactions: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            emoji: String,
        },
    ],
    // Attachments
    attachments: [  
        {
          url: String,
          type: String,
          name: String,
        }
    ],

    // Edit
    isEdited: { 
        type: Boolean, default: false 
    },
    editedAt: Date,
    // Read receipts
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
},
{ timestamps: true }
)

export const messageModel = model("message", messageSchema);