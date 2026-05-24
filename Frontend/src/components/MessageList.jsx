// MessageList.jsx

import React, { useEffect, useRef, useState } from "react";

import {
  MessageSquare,
  Pencil,
  SmilePlus,
} from "lucide-react";


import MessageContainer from "./MessageContainer";

function MessageList({
  messages = [],
  currentUserId,
  openThread,
  socket,
  onCopyMessage,
  onEditMessage,
  onDeleteMessage,
}) {

  const bottomRef =
    useRef(null);

  const emojis = [
    "😀", "😂", "😍", "🔥",
    "👍", "🎉", "😎", "😭",
    "❤️", "😅", "👏", "🤝",
  ];

  const addReaction = (
    messageId,
    emoji
  ) => {

    socket.emit(
      "react-message",
      {
        messageId,
        emoji,
      }
    );
  };

  useEffect(() => {

    bottomRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });

  }, [messages]);

  if (
    messages.length === 0
  ) {

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
        message.sender?._id ===
        currentUserId;

      return (

        <MessageContainer
        key={message._id}
        message={message}
        isMe={isMe}
        currentUserId={currentUserId}
        addReaction={addReaction}
        openThread={openThread}
        emojis={emojis}
        onCopyMessage={onCopyMessage}
        onEditMessage={onEditMessage}
        onDeleteMessage={onDeleteMessage}
        />

      );
    })}

    <div ref={bottomRef} />

  </div>
);
}

export default MessageList;