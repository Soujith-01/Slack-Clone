import React, { useEffect, useRef } from "react";
import {
  Pencil,
  SmilePlus,
} from "lucide-react";

function MessageList({
  messages = [],
  currentUserId,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-[#7D8596] bg-[#0F1117]">
        No messages yet
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-[#0F1117] px-4 py-4">

      {messages.map((message) => {
        const isMe =
          message.sender?._id === currentUserId;

        return (
          <div
            key={message._id}
            className={`group relative flex px-4 py-4 rounded-2xl transition-all duration-300 border border-transparent hover:border-[#2A2F3A] hover:bg-[#171A22] ${
              isMe
                ? "justify-end"
                : "justify-start"
            }`}
          >

            {/* HOVER TOOLBAR */}
            <div
              className={`absolute -top-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                isMe
                  ? "left-16"
                  : "right-16"
              }`}
            >

              <div className="flex items-center gap-1 bg-[#171A22]/95 border border-[#2A2F3A] rounded-2xl shadow-xl px-2 py-1 backdrop-blur-xl">

                <button className="hover:bg-[#232734] p-2 rounded-xl text-[#C8D1DC] hover:text-[#6EA4FF] transition-all duration-300 flex items-center gap-1">

                  <SmilePlus size={16} />

                  <span className="text-sm font-medium">
                    React
                  </span>

                </button>

                <button className="hover:bg-[#232734] p-2 rounded-xl text-[#C8D1DC] hover:text-[#6EA4FF] transition-all duration-300">
                  ⋮
                </button>

              </div>
            </div>

            {/* MESSAGE CONTAINER */}
            <div
              className={`flex gap-3 max-w-[75%] ${
                isMe
                  ? "flex-row-reverse text-right"
                  : ""
              }`}
            >

              {/* AVATAR */}
              <div className="flex-shrink-0">

                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#4F8CFF] to-[#3B6FD8] text-white flex items-center justify-center font-black text-sm shadow-lg">

                  {message.sender?.username
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}

                </div>

              </div>

              {/* CONTENT */}
              <div>

                {/* HEADER */}
                <div
                  className={`flex items-center gap-2 mb-2 ${
                    isMe
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <h4 className="font-bold text-[#E8ECF3] text-[15px] tracking-wide">

                    {isMe
                      ? "You"
                      : message.sender?.username ||
                        "Unknown User"}

                  </h4>

                  <span className="text-xs text-[#8B94A7] font-medium">

                    {new Date(
                      message.createdAt
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}

                  </span>

                  {message.isEdited && (
                    <span className="flex items-center gap-1 text-[11px] text-[#6EA4FF] italic">

                      <Pencil size={10} />

                      edited

                    </span>
                  )}

                </div>

                {/* MESSAGE TEXT */}
                {message.content && (
                  <div
                    className={`px-4 py-3 rounded-2xl border ${
                      isMe
                        ? "bg-gradient-to-br from-[#4F8CFF] to-[#3B6FD8] text-white border-[#5A8FFF]/20 shadow-lg"
                        : "bg-[#171A22] text-[#D6DCE5] border-[#2A2F3A]"
                    }`}
                  >

                    <p className="text-[15px] whitespace-pre-wrap leading-7 font-medium tracking-[0.01em]">

                      {message.content}

                    </p>

                  </div>
                )}

                {/* ATTACHMENTS */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 flex flex-col gap-2">
                    {message.attachments.map((att, i) => {
                      const isImage = att.type?.startsWith?.("image");
                      return (
                        <div key={i}>
                          {isImage ? (
                            <img
                              src={att.url}
                              alt={att.name || "attachment"}
                              className="max-w-[300px] rounded-xl border border-[#2A2F3A]"
                            />
                          ) : (
                            <a
                              href={att.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-block px-3 py-2 bg-[#0E1114] rounded-xl text-sm text-[#9AA4B2] border border-[#2A2F3A]"
                            >
                              {att.name || att.url}
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />

    </div>
  );
}

export default MessageList;