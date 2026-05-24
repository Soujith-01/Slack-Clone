import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, Send, Pencil } from "lucide-react";
import { getSocket } from "../../socket";

function ThreadPanel({ thread, chat, onClose }) {
  const [replies, setReplies] = useState([]);
  const [content, setContent] = useState("");
  useEffect(() => {
  const socket = getSocket();

  const handler = (data) => {
    console.log("THREAD EVENT:", data);

    const parentId =
      data.parentMessageId ||
      data.parentMessage?._id;

    if (!parentId) return;
    if (parentId !== thread._id) return;

    setReplies((prev) => {
      const exists = prev.some((r) => r._id === data.reply._id);
      if (exists) return prev;

      return [...prev, data.reply];
    });
  };

  socket.on("thread-message-received", handler);

  return () => {
    socket.off("thread-message-received", handler);
  };
}, [thread?._id]);

  // RESET ON THREAD CHANGE
  useEffect(() => {
    setReplies([]);
  }, [thread?._id]);

  // FETCH REPLIES
  useEffect(() => {
  if (!thread?._id) return;

  const fetchReplies = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/message-api/thread/${thread._id}`,
        { withCredentials: true }
      );

      setReplies(
        Array.isArray(res.data)
          ? res.data
          : res.data.payload || []
      );
    } catch (err) {
      console.log(err);
    }
  };

  fetchReplies();
}, [thread?._id]);

  // SEND REPLY
  const sendReply = () => {
    if (!content.trim()) return;

    getSocket().emit("send-thread-message", {
      parentMessageId: thread._id,
      content,
      chatId: chat._id,
    });

    setContent("");
  };

  return (
    <div className="w-[400px] bg-[#111318] border-l border-[#2A2F3A] flex flex-col">

      {/* HEADER */}
      <div className="h-16 px-5 border-b border-[#2A2F3A] flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-lg">Thread</h2>
          <p className="text-xs text-[#8B94A7]">Reply in thread</p>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl hover:bg-[#171A22] flex items-center justify-center text-[#8B94A7]"
        >
          <X size={18} />
        </button>
      </div>

      {/* ORIGINAL MESSAGE */}
      <div className="p-5 border-b border-[#2A2F3A]">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F8CFF] to-[#3B6FD8] flex items-center justify-center text-white font-bold">
            {thread.sender?.username?.charAt(0)?.toUpperCase()}
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm">
              {thread.sender?.username}
            </h3>

            <p className="text-[#D6DCE5] text-sm mt-1">
              {thread.content}
            </p>
          </div>
        </div>
      </div>

      {/* REPLIES */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {replies.length === 0 ? (
          <div className="text-sm text-[#8B94A7] flex justify-center items-center h-full">
            No replies yet
          </div>
        ) : (
          replies.map((reply) => (
            <div key={reply._id} className="flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F8CFF] to-[#3B6FD8] flex items-center justify-center text-white font-bold text-sm">
                {reply.sender?.username?.charAt(0)?.toUpperCase()}
              </div>

              <div className="flex-1">
                <h4 className="text-sm text-white font-semibold">
                  {reply.sender?.username}
                </h4>

                <div className="mt-1 bg-[#171A22] border border-[#2A2F3A] rounded-2xl px-4 py-3">
                  <p className="text-sm text-[#D6DCE5]">
                    {reply.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-[#2A2F3A] flex gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
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