import React, { useState } from "react";

import axios from "axios";

import { toast } from "react-hot-toast";

import {
  Send,
  SmilePlus,
} from "lucide-react";

import { getSocket } from "../socket";

import Popup from "reactjs-popup";

import FileTransfer from "./FileTransfer";

function MessageSender({
  chat,
  currentUser,
}) {

  const [content, setContent] =
    useState("");

  const [selectedFiles, setSelectedFiles] =
    useState([]);

  const [sending, setSending] =
    useState(false);

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL ||
    "http://localhost:3000";

  // CUSTOM EMOJIS
  const emojis = [
    "😀", "😂", "😍", "🔥",
    "👍", "🎉", "😎", "😭",
    "❤️", "😅", "👏", "🤝",
  ];

  // FILE UPLOAD
  const uploadSelectedFiles =
    async () => {

      if (
        selectedFiles.length === 0
      ) return [];

      const formData =
        new FormData();

      if (
        selectedFiles.length === 1
      ) {

        formData.append(
          "file",
          selectedFiles[0]
        );

      } else {

        selectedFiles.forEach(
          (file) =>
            formData.append(
              "files",
              file
            )
        );
      }

      const url =
        selectedFiles.length === 1
          ? `${backendUrl}/fileTransfer-api`
          : `${backendUrl}/fileTransfer-api/multiple`;

      const res = await axios.post(
        url,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      if (!res.data?.success) {

        throw new Error(
          res.data?.message ||
          "Upload failed"
        );
      }

      return selectedFiles.length === 1
        ? [res.data.file]
        : res.data.files;
    };

  const handleSendMessage =
    async (e) => {

      e.preventDefault();

      if (
        !content.trim() &&
        selectedFiles.length === 0
      ) return;

      const socket = getSocket();

      if (!socket) {

        console.log(
          "Socket not connected"
        );

        return;
      }

      const receiverId =
        chat.type === "dm"
          ? chat.members.find(
              (member) =>
                member._id !==
                currentUser._id
            )?._id
          : undefined;

      // TEXT MESSAGE
      const sendTextMessage =
        () => {

          if (
            !content.trim()
          ) return;

          if (
            chat.type === "channel"
          ) {

            socket.emit(
              "send-channel-message",
              {
                channelId:
                  chat._id,
                content,
              }
            );
          }

          if (
            chat.type === "dm"
          ) {

            socket.emit(
              "send-dm",
              {
                receiverId,
                content,
                chatId:
                  chat._id,
              }
            );
          }
        };

      try {

        setSending(true);

        // FILE MESSAGE
        if (
          selectedFiles.length > 0
        ) {

          const uploadedFiles =
            await uploadSelectedFiles();

          const attachments =
            uploadedFiles.map(
              (file) => ({
                url: file.url,
                name:
                  file.fileName,
                type: file.type,
              })
            );
            console.log(attachments);
console.log(typeof attachments);
          socket.emit(
            "send-file",
            {
              chatId:
                chat._id,
              chatType:
                chat.type,
              receiverId,
              content:
                content.trim(),
              attachments,
            }
          );

        } else {

          sendTextMessage();
        }

        setContent("");
        setSelectedFiles([]);

      } catch (err) {

        console.error(err);

        toast.error(
          err.response?.data
            ?.message ||
          err.message ||
          "Send failed"
        );

      } finally {

        setSending(false);
      }
    };

  return (

  <form
    onSubmit={handleSendMessage}
    className="p-5 bg-[#171A22]/95 backdrop-blur-xl relative"
  >

    {/* MESSAGE BAR */}
    <div className="flex gap-3 items-end bg-[#111318] border border-[#2A2F3A] rounded-3xl px-4 py-3 shadow-[0_0_25px_rgba(0,0,0,0.25)] focus-within:border-[#4F8CFF] focus-within:shadow-[0_0_30px_rgba(79,140,255,0.15)] transition-all duration-300 overflow-visible">

      {/* LEFT ACTIONS */}
      <div className="flex items-center gap-2 self-end pb-1">

        {/* FILE TRANSFER */}
        <FileTransfer
          selectedFiles={selectedFiles}
          onFilesChange={setSelectedFiles}
        />

        {/* EMOJI */}
        <div className="relative self-end">

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
          setContent(e.target.value)
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
        disabled={
          sending ||
          (
            !content.trim() &&
            selectedFiles.length === 0
          )
        }
        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
          content.trim() ||
          selectedFiles.length > 0
            ? "bg-[linear-gradient(135deg,#4F8CFF,#3B6FD8)] text-white hover:scale-105 shadow-[0_0_25px_rgba(79,140,255,0.35)]"
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