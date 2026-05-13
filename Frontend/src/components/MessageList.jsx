import React, { useEffect, useRef } from "react";
import {
  CheckCheck,
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
      <div className="h-full flex items-center justify-center text-gray-400 bg-[#f8f9fb]">
        No messages yet
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-white px-4 py-3">
      {messages.map((message) => {
        const isMe =
          message.sender?._id === currentUserId;

        return (
          <div
  key={message._id}
  className={`group relative flex px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-100 ${
    isMe
      ? "justify-end"
      : "justify-start"
  }`}
>
  {/* Hover Toolbar */}
  <div
    className={`absolute -top-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 ${
      isMe ? "left-16" : " right-16"
    }`}
  >
    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl shadow-md px-2 py-1">
      <button className="hover:bg-gray-100 p-1 rounded-md text-sm  flex items-center gap-1">
        <SmilePlus size={16} /> <span>React</span>
      </button>

      <button className="hover:bg-gray-100 p-1 rounded-md">
        ⋮
      </button>
    </div>
  </div>

  <div
    className={`flex gap-3 max-w-[75%] ${
      isMe
        ? "flex-row-reverse text-right"
        : ""
    }`}
  >
    {/* Avatar */}
    <div className="flex-shrink-0">
      <div className="w-10 h-10 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-semibold text-sm">
        {message.sender?.username
          ?.charAt(0)
          ?.toUpperCase() || "U"}
      </div>
    </div>

    {/* Content */}
    <div>
      {/* Header */}
      <div
        className={`flex items-center gap-2 mb-1 ${
          isMe
            ? "justify-end"
            : "justify-start"
        }`}
      >
        <h4 className="font-semibold text-gray-900 text-[15px]">
          {isMe
            ? "You"
            : message.sender?.username ||
              "Unknown User"}
        </h4>

        <span className="text-xs text-gray-500">
          {new Date(
            message.createdAt
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>

        {message.isEdited && (
          <span className="flex items-center gap-1 text-[11px] text-gray-400 italic">
            <Pencil size={10} />
            edited
          </span>
        )}
      </div>

      {/* Message */}
      {message.content && (
        <p className="text-[15px] text-gray-800 whitespace-pre-wrap leading-6">
          {message.content}
        </p>
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