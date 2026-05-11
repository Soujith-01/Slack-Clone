// MessageSender.jsx

import React, {useState,} from "react";
import { Send } from "lucide-react";
import { socket } from "../socket";

function MessageSender({
  chat,
  currentUser,
}) {

  const [content, setContent] =
    useState("");

  const handleSendMessage = (
    e
  ) => {

    e.preventDefault();

    if (!content.trim()) return;


    // ======================================
    // CHANNEL MESSAGE
    // ======================================
    if (chat.type ==="channel") {
      console.log({channelId: chat._id,content});
      socket.emit(
        "send-channel-message",
        {
          channelId: chat._id,
          content,
        }
      );
    }


    // ======================================
    // DM MESSAGE
    // ======================================
    if (chat.type === "dm") {
      const receiverId =
        chat.members.find(
          (member) =>
            member._id !==
            currentUser._id
        )?._id;

      socket.emit(
        "send-dm",
        {
          receiverId,
          content,
          chatId: chat._id,
        }
      );
    }

    setContent("");
  };

  return (
    <form onSubmit={handleSendMessage} className="p-4 bg-white">

      <div className="flex gap-3 border rounded-2xl px-4 py-3">

        <textarea
          rows={1}
          value={content}
          onChange={(e) =>
            setContent(
              e.target.value
            )
          }
          placeholder="Type a message..."
          className="flex-1 resize-none outline-none"
          onKeyDown={(e) => {

            if (e.key === "Enter" && e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
        />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded-xl">
          <Send size={18} />
        </button>

      </div>
    </form>
  );
}

export default MessageSender;