import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    // DM or Channel
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },

    channel: {
      type: Schema.Types.ObjectId,
      ref: "channel",
      default: null,
    },

    content: {
      type: String,
      trim: true,
      default:"",
    },

    //threads
    parentMessage: {
      type: Schema.Types.ObjectId,
      ref: "message",
      default: null,
    },
    //msg reactions 
    reactions: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
        emoji: String,
      },
    ],

   //file or image attachments
    attachments: [
      {
        url: {
          type: String,
        },
        type: {
          type: String,
        },
        name: {
          type: String,
        },
      },
    ],
    //editing messages
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: Date,

    //Read receipts  
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

export const MessageModel = model("message", messageSchema);