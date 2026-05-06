import exp from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { MessageModel } from "../models/MessageModel.js";
import { chatModel } from "../models/ChatModel.js";

export const messageApp = exp.Router();


// Get Channel Messages
messageApp.get("/get-channel", verifyToken, async (req, res) => {
    const { channelName } = req.body;

    // check channel exists
    const channel = await chatModel.findOne({channelName})
    if (!channel || channel.type !== "channel") {
      return res.status(404).json({ message: "Channel not found" });
    }

    // check if user is part of channel
    if (!channel.members.includes(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // fetch messages
    const messages = await MessageModel.find({ channel: channel._id })
      .populate("sender", "username  email")
      .sort({ createdAt: 1 });

    res.status(200).json({
      message: "Channel messages fetched",
      payload: messages
    });
});


// Get DM Messages
messageApp.get("/get-dm", verifyToken, async (req, res) => {
    const { chatId } = req.body;

    const chat = await chatModel.findById(chatId);

    if (!chat || chat.type !== "dm") {
      return res.status(404).json({ message: "it is not a DM" });
    }

    // check if user is part of DM
    if (!chat.members.includes(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const [user1, user2] = chat.members;

    const messages = await MessageModel.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    })
      .populate("sender", "username email")
      .sort({ createdAt: 1 });

    res.status(200).json({
      message: "DM messages fetched",
      payload: messages
    });

  
});


//3. Edit Message
messageApp.patch("/edit", verifyToken, async (req, res) => {
    const { messageId,content } = req.body;
    

    const message = await MessageModel.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // only sender can edit
    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    message.content = content;
    message.isEdited = true;
    message.editedAt = new Date();

    await message.save();

    res.status(200).json({
      message: "Message updated",
      payload: message
    });

  
});


// 4. Delete Message
messageApp.delete("/delete", verifyToken, async (req, res) => {
    const { messageId,content } = req.body;
    const message = await MessageModel.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    // only sender can delete
    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }
    await MessageModel.findByIdAndDelete(messageId);
    res.status(200).json({ message: "Message deleted" });

});

