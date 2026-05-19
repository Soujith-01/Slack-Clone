import React, { useState } from "react";

import {
  Send,
  SmilePlus,
  Paperclip,
} from "lucide-react";

import { getSocket } from "../socket";
import Popup from "reactjs-popup";

function MessageSender({chat,currentUser}) {

  const [content, setContent] = useState("");

  // CUSTOM EMOJIS
  const emojis = [
    "😀","😂","😍","🔥",
    "👍","🎉","😎","😭",
    "❤️","😅","👏","🤝",
  ];
  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    // CHANNEL MESSAGE
    if (chat.type === "channel") {

      const socket = getSocket();

      if (!socket) {
        console.log("Socket not connected");
        return;
      }
      socket.emit(
        "send-channel-message",
        {
          channelId: chat._id,
          content,
        }
      );
    }

    // DM MESSAGE
    if (chat.type === "dm") {

      const receiverId =
        chat.members.find((member) =>
            member._id !== currentUser._id
        )?._id;

      const socket = getSocket();

      if (!socket) {
        console.log("Socket not connected");
        return;
      }
      socket.emit( "send-dm",
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
  <form onSubmit={handleSendMessage} className="p-5 bg-[#171A22]/95 backdrop-blur-xl relative overflow-visible">
      <div className="flex items-end gap-3 bg-[#111318] border border-[#2A2F3A] rounded-3xl px-4 py-3 shadow-[0_0_25px_rgba(0,0,0,0.25)] focus-within:border-[#4F8CFF] focus-within:shadow-[0_0_30px_rgba(79,140,255,0.15)] transition-all duration-300 overflow-visible">
        {/* LEFT ACTIONS */}
        <div className="flex items-center gap-2 pb-1 relative overflow-visible">
          {/* ATTACH */}
          <button
            type="button"
            className="w-10 h-10 rounded-2xl bg-[#171A22] hover:bg-[#232734] text-[#9AA4B2] hover:text-[#4F8CFF] flex items-center justify-center transition-all duration-300"
          >

            <Paperclip size={18} />

          </button>



          {/* EMOJI BUTTON */}
<div className="relative">

  <Popup
  trigger={
    <button
      type="button"
      className="w-10 h-10 rounded-2xl bg-[#171A22] hover:bg-[#232734] text-[#9AA4B2] hover:text-[#4F8CFF] flex items-center justify-center transition-all duration-300"
    >
      <SmilePlus size={18} />
    </button>
  }
  position="top left"
  closeOnDocumentClick
  arrow={false}
>
  {(close) => (
    <div className="bg-[#1B1F27] border border-[#2A2F3A] shadow-2xl rounded-2xl p-3 w-64">

      <div className="grid grid-cols-6 gap-2">

        {emojis.map((emoji) => (

          <button
            key={emoji}
            type="button"
            onClick={() => {

              setContent(
                (prev) =>
                  prev + emoji
              );

              close();
            }}
            className="text-2xl hover:scale-125 transition-transform duration-200 p-1 rounded-lg hover:bg-[#2A2F3A]"
          >

            {emoji}

          </button>
        ))}

      </div>

    </div>
  )}
</Popup>

</div>

        </div>



        {/* INPUT */}
        <textarea
          rows={1}

          value={content}

          onChange={(e) =>
            setContent(
              e.target.value
            )
          }

          placeholder={`Message ${
            chat?.type === "channel"
              ? `#${chat?.channelName}`
              : chat?.channelName
          }`}

          className="flex-1 resize-none bg-transparent outline-none text-[15px] text-[#E7ECF5] placeholder:text-[#6F7887] leading-7 py-2 max-h-40 overflow-y-auto"

          onKeyDown={(e) => {

            if (
              e.key === "Enter" &&
              !e.shiftKey
            ) {

              e.preventDefault();

              handleSendMessage(e);
            }
          }}
        />



        {/* SEND BUTTON */}
        <button
          type="submit"

          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
            content.trim()
              ? "bg-gradient-to-br from-[#4F8CFF] to-[#3B6FD8] text-white hover:scale-105 shadow-[0_0_25px_rgba(79,140,255,0.35)]"
              : "bg-[#232734] text-[#6F7887] cursor-not-allowed"
          }`}
        >

          <Send size={19} />

        </button>

      </div>

    </form>
  );
}

export default MessageSender;