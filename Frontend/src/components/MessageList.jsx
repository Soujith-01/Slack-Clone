import React, { useEffect, useRef } from "react";
import {
  MessageSquare,
  Pencil,
  SmilePlus,
} from "lucide-react";
import Popup from "reactjs-popup";

function MessageList({messages = [], currentUserId,openThread,}) {
  const bottomRef = useRef(null);
  const emojis = [
    "😀", "😂", "😍", "🔥",
    "👍", "🎉", "😎", "😭",
    "❤️", "😅", "👏", "🤝",
  ];

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

                <Popup
  trigger={
    <button className="hover:bg-[#232734] p-2 rounded-xl text-[#C8D1DC] hover:text-[#6EA4FF] transition-all duration-300 flex items-center gap-1">
      <SmilePlus size={16} />

      <span className="text-sm font-medium">
        React
      </span>
    </button>
  }
  position="bottom center"
  arrow={false}
  closeOnDocumentClick
  repositionOnResize
  keepTooltipInside="body"
  contentStyle={{
    background: "transparent",
    border: "none",
    padding: 0,
  }}
>
  <div className="bg-[#171A22] border border-[#2A2F3A] rounded-2xl p-3 shadow-2xl flex gap-2 flex-wrap w-[220px]">

    {emojis.map((emoji, index) => (
      <button
        key={index}
        onClick={() => console.log(emoji)}
        className="text-2xl hover:scale-125 transition-all duration-200"
      >
        {emoji}
      </button>
    ))}

  </div>
</Popup>

                <button onClick={() => openThread(message)} className="hover:bg-[#232734] p-2 rounded-xl text-[#C8D1DC] hover:text-[#6EA4FF] transition-all duration-300">
                  <MessageSquare size={16} />
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

  <div>

    {/* MESSAGE */}
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



    {/* THREAD PREVIEW */}
    {message.threadCount > 0 && (

      <button
        onClick={() =>
          openThread(message)
        }

        className="mt-2 flex items-center gap-2 hover:bg-[#171A22] px-2 py-1 rounded-xl transition-all duration-200"
      >

        {/* SMALL AVATAR */}
        <div className="w-6 h-6 rounded-md bg-[#4F8CFF] text-white flex items-center justify-center text-xs font-bold">

          {
            message.sender?.username
              ?.charAt(0)
              ?.toUpperCase()
          }

        </div>

        {/* REPLY COUNT */}
        <span className="text-[#6EA4FF] text-sm font-medium">

          {message.threadCount} reply

        </span>

        {/* TIME */}
        <span className="text-[#8B94A7] text-xs">

          Today at{" "}

          {new Date(
            message.createdAt
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}

        </span>

      </button>
    )}

  </div>
)}

                {/* ATTACHMENTS */}
{message.attachments?.length > 0 && (
  <div className="mt-3 flex flex-col gap-3">

    {message.attachments.map((att, i) => {

      const fileType = att.type || "";
      const isImage = fileType.startsWith("image/");
      const isPDF = fileType === "application/pdf";

      return (

        <div key={i}>

          {/* IMAGE PREVIEW */}
          {isImage && (

            <a
              href={att.url}
              target="_blank"
              rel="noreferrer"
            >

              <img
                src={att.url}
                alt={att.name || "image"}
                className="max-w-[320px] rounded-2xl border border-[#2A2F3A] hover:opacity-90 transition-all cursor-pointer"
              />

            </a>
          )}

          {/* PDF PREVIEW */}
          {/* PDF PREVIEW */}
{isPDF && (

  <div className="flex flex-col gap-2">

    <a
      href={att.url}
      target="_blank"
      rel="noreferrer"
      className="w-[320px] h-[180px] rounded-2xl border border-[#2A2F3A] bg-[#171A22] flex flex-col items-center justify-center hover:bg-[#232734] transition-all"
    >

      <div className="text-5xl">
        📕
      </div>

      <p className="mt-3 text-sm text-[#E7ECF5] font-medium text-center px-4 break-all">
        {att.name}
      </p>

      <span className="mt-2 text-xs text-[#6EA4FF]">
        Click to Open PDF
      </span>

    </a>

    <a
      href={att.url.replace(
        "/upload/",
        "/upload/fl_attachment/"
      )}
      target="_blank"
      rel="noreferrer"
      className="px-4 py-2 bg-[#4F8CFF] text-white rounded-xl text-sm w-fit hover:scale-105 transition-all"
    >
      Download PDF
    </a>

  </div>
)}
          {/* OTHER FILES */}
          {!isImage && !isPDF && (

            <div className="flex items-center gap-3 px-4 py-3 bg-[#171A22] border border-[#2A2F3A] rounded-2xl">

              <div className="text-3xl">
                📄
              </div>

              <div className="flex-1 min-w-0">

                <p className="text-[#E7ECF5] text-sm truncate">
                  {att.name}
                </p>

                <p className="text-[#8B94A7] text-xs">
                  {fileType}
                </p>

              </div>

              <a
                href={att.url}
                target="_blank"
                rel="noreferrer"
                download
                className="px-3 py-2 rounded-xl bg-[#4F8CFF] text-white text-sm hover:scale-105 transition-all"
              >
                Download
              </a>

            </div>
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