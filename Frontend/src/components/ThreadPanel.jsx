import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  X,
  Send,
} from "lucide-react";

import { getSocket } from "../socket";

function ThreadPanel({ thread, chat, onClose,}) {

  const [replies, setReplies] = useState([]);

  const [content, setContent] = useState("");
  // FETCH REPLIES
  useEffect(() => {
    const fetchReplies =async () => {
        const res = await axios.get( `http://localhost:3000/message-api/thread/${thread._id}`,
            {
              withCredentials: true,
            }
        );
        setReplies(res.data);
    };
    fetchReplies();
}, [thread]);

// SOCKET
// SOCKET
useEffect(() => {

  const socket = getSocket();

  socket.on(
    "receive-thread-message",
    (reply) => {
        console.log(reply);
      if (
        reply.parentMessage?.toString() ===
        thread._id?.toString()
      ) {

        setReplies((prev) => [
          ...prev,
          reply,
        ]);
      }
    }
  );

  return () =>
    socket.off(
      "receive-thread-message"
    );

}, [thread]);

// SEND REPLY
const sendReply = () => {
    if (!content.trim()) return;
    getSocket().emit( "send-thread-message",
        {
            parentMessageId: thread._id,
            content,
            chatId: chat._id,
        }
    );
    setContent("");
};
return (
    <div className="w-[380px] border-l border-[#2A2F3A] bg-[#111318] flex flex-col">

      {/* HEADER */}
      <div className="p-4 border-b border-[#2A2F3A] flex items-center justify-between">

        <h2 className="text-white font-bold">
          Thread
        </h2>

        <button
          onClick={onClose}
          className="text-[#8B94A7]"
        >
          <X size={18} />
        </button>

      </div>



      {/* ORIGINAL MESSAGE */}
      <div className="p-4 border-b border-[#2A2F3A]">

        <h3 className="text-white font-semibold mb-1">

          {
            thread.sender
              ?.username
          }

        </h3>

        <p className="text-[#D6DCE5]">

          {thread.content}

        </p>

      </div>



      {/* REPLIES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {replies.map((reply) => (

          <div key={reply._id}>

            <h4 className="text-sm font-semibold text-white">

              {
                reply.sender
                  ?.username
              }

            </h4>

            <p className="text-[#D6DCE5] text-sm">

              {reply.content}

            </p>

          </div>
        ))}

      </div>



      {/* INPUT */}
      <div className="p-4 border-t border-[#2A2F3A] flex gap-2">

        <input
          value={content}

          onChange={(e) =>
            setContent(
              e.target.value
            )
          }

          placeholder="Reply..."

          className="flex-1 bg-[#171A22] border border-[#2A2F3A] rounded-xl px-4 py-2 text-white outline-none"
        />

        <button
          onClick={sendReply}
          className="bg-[#4F8CFF] text-white p-2 rounded-xl"
        >
          <Send size={18} />
        </button>

      </div>
    </div>
  );
}

export default ThreadPanel;