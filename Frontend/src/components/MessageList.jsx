import React, { useEffect, useRef } from "react";
import { CheckCheck, Pencil } from "lucide-react";

function MessageList({ messages = [], currentUserId }) {
  const bottomRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Empty state
  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 bg-[#f8f9fb]">
        No messages yet
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-4 py-4 space-y-4 bg-[#f8f9fb]">
      {messages.map((message) => {
        const isMe =
          message.sender?._id === currentUserId;

        return (
          <div
            key={message._id}
            className={`flex ${
              isMe
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                isMe
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-900"
              }`}
            >
              {/* Sender */}
              {!isMe && (
                <p className="text-sm font-semibold mb-1">
                  {message.sender?.username ||
                    "Unknown User"}
                </p>
              )}

              {/* Message */}
              {message.content && (
                <p className="text-sm whitespace-pre-wrap">
                  {message.content}
                </p>
              )}

              {/* Attachments */}
              {message.attachments?.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.attachments.map(
                    (file, index) => (
                      <div key={index}>
                        {file.type?.startsWith(
                          "image"
                        ) ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="rounded-lg max-h-72 object-cover"
                          />
                        ) : (
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noreferrer"
                            className={`underline text-sm ${
                              isMe
                                ? "text-blue-100"
                                : "text-blue-600"
                            }`}
                          >
                            {file.name ||
                              "Attachment"}
                          </a>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Reactions */}
              {message.reactions?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {message.reactions.map(
                    (reaction, index) => (
                      <div
                        key={index}
                        className={`px-2 py-1 rounded-full text-xs ${
                          isMe
                            ? "bg-blue-400"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {reaction.emoji}
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Thread */}
              {message.parentMessage && (
                <div
                  className={`mt-2 text-xs italic border-l-2 pl-2 ${
                    isMe
                      ? "border-blue-200 text-blue-100"
                      : "border-gray-300 text-gray-500"
                  }`}
                >
                  Reply in thread
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 mt-2 text-[11px]">
                
                {/* Edited */}
                {message.isEdited && (
                  <div className="flex items-center gap-1 opacity-80">
                    <Pencil size={10} />
                    <span>edited</span>
                  </div>
                )}

                {/* Time */}
                <span
                  className={
                    isMe
                      ? "text-blue-100"
                      : "text-gray-400"
                  }
                >
                  {new Date(
                    message.createdAt
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                {/* Read */}
                {isMe &&
                  message.readBy?.length > 0 && (
                    <CheckCheck
                      size={14}
                      className="text-blue-100"
                    />
                  )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Auto Scroll Anchor */}
      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;