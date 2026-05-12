import jwt from "jsonwebtoken";
import { MessageModel } from "../models/MessageModel.js";
import { chatModel } from "../models/ChatModel.js";
import { verifysocket } from "../middlewares/verifySocket.js";

export const setupSocket = (io) => {

  // store online users
  const onlineUsers = {};

  //auth middleware
  io.use(verifysocket)

  // Connection
  io.on("connection", (socket) => {
    console.log("SOCKET CONNECTED"); // added remove later
    const userId = socket.user.userId;

    // track user
    onlineUsers[userId] = socket.id;

    console.log("User connected:", userId);

    // Join Channel
    socket.on("join-channel", (channelId) => {
      socket.join(channelId);
      console.log(`User ${userId} joined channel ${channelId}`);
    });

    // Send Channel Message
    socket.on(
  "send-channel-message",
  async ({ channelId, content }) => {

    try {

      console.log("MESSAGE RECEIVED");
      console.log("USER:", userId);
      console.log("CHANNEL:", channelId);
      console.log("CONTENT:", content);

      const message =
        await MessageModel.create({
          sender: userId,
          channel: channelId,
          content,
        });

      console.log("MESSAGE SAVED:", message);

      await chatModel.findByIdAndUpdate(
        channelId,
        {
          latestMessage: message._id,
        }
      );

      const populatedMessage =
        await MessageModel.findById(
          message._id
        ).populate(
          "sender",
          "username email"
        );

      io.to(channelId).emit(
        "receive-channel-message",
        populatedMessage
      );

    } catch (err) {

      console.log(
        "CHANNEL MESSAGE ERROR:"
      );

      console.log(err);
    }
  }
);

    //Send DM
    socket.on("send-dm", async ({ receiverId, content, chatId }) => {
      try {
        const message = await MessageModel.create({
          sender: userId,
          receiver: receiverId,
          content,
        });

        // update latest message
        await chatModel.findByIdAndUpdate(chatId, {
          latestMessage: message._id,
        });

        const receiverSocket = onlineUsers[receiverId];

        const populatedMessage = await MessageModel.findById(message._id)
        .populate("sender", "username email");
        if (receiverSocket) {
          io.to(receiverSocket).emit("receive-dm",populatedMessage);
        }
        socket.emit("receive-dm", populatedMessage );

      } catch (err) {
        console.log("DM error:", err);
      }
    });


    //message reaction
    socket.on("react-message", async ({ messageId, emoji }) => {
  const userId = socket.user.userId;

  const message = await MessageModel.findById(messageId);

  const existing = message.reactions.find(
    r => r.user.toString() === userId && r.emoji === emoji
  );

  if (existing) {
    message.reactions = message.reactions.filter(
      r => !(r.user.toString() === userId && r.emoji === emoji)
    );
  } else {
    message.reactions.push({ user: userId, emoji });
  }

  await message.save();

  // send update to all users
  io.emit("reaction-updated", message);
  });

  //Edit message
  socket.on("edit-message", async ({ messageId, newContent }) => {
  const userId = socket.user.userId;

  const message = await MessageModel.findById(messageId);

  if (message.sender.toString() !== userId) return;

  message.content = newContent;
  message.isEdited = true;
  message.editedAt = new Date();

  await message.save();

  io.emit("message-edited", message);
});


//thread replies
socket.on("send-thread-message", async ({ parentMessageId, content, chatId }) => {
  const userId = socket.user.userId;

  const reply = await MessageModel.create({
    sender: userId,
    content,
    channel: chatId,
    parentMessage: parentMessageId
  });

  io.to(chatId).emit("receive-thread-message", reply);
});

//file transfer
socket.on("send-file", async ({ chatId, fileUrl, fileName, fileType }) => {
  const userId = socket.user.userId;

  try {
    const message = await MessageModel.create({
      sender: userId,
      channel: chatId,
      attachments: [
        {
          url: fileUrl,
          name: fileName,
          type: fileType
        }
      ]
    });

    // update latest message
    await chatModel.findByIdAndUpdate(chatId, {
      latestMessage: message._id
    });

    // send to channel
    io.to(chatId).emit("receive-message", message);

  } catch (err) {
    console.log("File send error:", err.message);
  }
});
    // Disconnect
socket.on("disconnect", () => {
    delete onlineUsers[userId];
    console.log("User disconnected:", userId);
  });
});
};