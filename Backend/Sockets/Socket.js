// setupSocket.js

import { MessageModel } from "../models/MessageModel.js";
import { chatModel } from "../models/ChatModel.js";
import { verifysocket } from "../middlewares/verifySocket.js";

export const setupSocket = (io) => {

  const onlineUsers = {};

  io.use(verifysocket);

  io.on("connection", (socket) => {

    const userId = socket.user.userId;

    onlineUsers[userId] = socket.id;

    console.log("USER CONNECTED:", userId);



    // JOIN CHANNEL
    socket.on("join-channel", (channelId) => {

      socket.join(channelId);

      console.log(`USER ${userId} JOINED ${channelId}`);
    });



    // CHANNEL MESSAGE
    socket.on("send-channel-message", async ({ channelId, content }) => {

      const message = await MessageModel.create({
        sender: userId,
        channel: channelId,
        content,
      });

      await chatModel.findByIdAndUpdate(channelId, {
        latestMessage: message._id,
      });

      const populatedMessage =
        await MessageModel.findById(message._id)
          .populate("sender", "username email");

      io.to(channelId).emit(
        "receive-channel-message",
        populatedMessage
      );
    });



    // DM MESSAGE
    socket.on("send-dm", async ({ receiverId, content, chatId }) => {

      const message = await MessageModel.create({
        sender: userId,
        receiver: receiverId,
        content,
      });

      await chatModel.findByIdAndUpdate(chatId, {
        latestMessage: message._id,
      });

      const populatedMessage =
        await MessageModel.findById(message._id)
          .populate("sender", "username email");

      const receiverSocket =
        onlineUsers[receiverId];

      if (receiverSocket) {

        io.to(receiverSocket).emit(
          "receive-dm",
          populatedMessage
        );
      }

      socket.emit(
        "receive-dm",
        populatedMessage
      );
    });



    // THREAD MESSAGE
    socket.on("send-thread-message", async ({ parentMessageId, content, chatId }) => {

      const reply = await MessageModel.create({
        sender: userId,
        content,
        channel: chatId,
        parentMessage: parentMessageId,
      });

      const populatedReply =
        await MessageModel.findById(reply._id)
          .populate("sender", "username email");

      io.to(chatId).emit(
        "receive-thread-message",
        populatedReply
      );
    });



    // REACT MESSAGE
    socket.on("react-message", async ({ messageId, emoji }) => {

      const message =
        await MessageModel.findById(messageId);

      const existing =
        message.reactions.find(
          (r) =>
            r.user.toString() === userId &&
            r.emoji === emoji
        );

      if (existing) {

        message.reactions =
          message.reactions.filter(
            (r) =>
              !(
                r.user.toString() === userId &&
                r.emoji === emoji
              )
          );

      } else {

        message.reactions.push({
          user: userId,
          emoji,
        });
      }

      await message.save();

      io.emit(
        "reaction-updated",
        message
      );
    });



    // EDIT MESSAGE
    socket.on("edit-message", async ({ messageId, newContent }) => {

      const message =
        await MessageModel.findById(messageId);

      if (
        message.sender.toString() !== userId
      ) return;

      message.content = newContent;

      message.isEdited = true;

      message.editedAt = new Date();

      await message.save();

      io.emit(
        "message-edited",
        message
      );
    });



    // SEND FILE
    socket.on("send-file", async ({ chatId, fileUrl, fileName, fileType }) => {

      const message = await MessageModel.create({
        sender: userId,

        channel: chatId,

        attachments: [
          {
            url: fileUrl,
            name: fileName,
            type: fileType,
          },
        ],
      });

      await chatModel.findByIdAndUpdate(chatId, {
        latestMessage: message._id,
      });

      const populatedMessage =
        await MessageModel.findById(message._id)
          .populate("sender", "username email");

      io.to(chatId).emit(
        "receive-file",
        populatedMessage
      );
    });



    // DISCONNECT
    socket.on("disconnect", () => {

      delete onlineUsers[userId];

      console.log(
        "USER DISCONNECTED:",
        userId
      );
    });
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
socket.on(
  "send-file",
  async ({ chatId, chatType, receiverId, attachments, content, fileUrl, fileName, fileType }) => {
    const userId = socket.user.userId;

    try {
      // Support both older payload shape (fileUrl/fileName/fileType)
      // and newer payload that sends an `attachments` array from frontend.
      const effectiveAttachments =
        Array.isArray(attachments) && attachments.length > 0
          ? attachments.map((a) => ({ url: a.url, name: a.name || a.fileName, type: a.type }))
          : fileUrl
          ? [
              {
                url: fileUrl,
                name: fileName,
                type: fileType,
              },
            ]
          : [];

      const messageData = {
        sender: userId,
        content: content || "",
        attachments: effectiveAttachments,
      };

      if (chatType === "dm") {
        messageData.receiver = receiverId;
      } else {
        messageData.channel = chatId;
      }
      console.log(messageData)
      const message = await MessageModel.create(messageData);

      // update latest message
      await chatModel.findByIdAndUpdate(chatId, {
        latestMessage: message._id,
      });

      const populatedMessage = await MessageModel.findById(message._id).populate("sender", "username email");

      // send to the correct room/event
      if (chatType === "dm") {
        const receiverSocket = onlineUsers[receiverId];
        if (receiverSocket) {
          io.to(receiverSocket).emit("receive-dm", populatedMessage);
        }

        socket.emit("receive-dm", populatedMessage);
      } else {
        io.to(chatId).emit("receive-channel-message", populatedMessage);
      }
    } catch (err) {
      console.log(err);
    }
  }
);
    // Disconnect
socket.on("disconnect", () => {
    delete onlineUsers[userId];
    console.log("User disconnected:", userId);
  });
};