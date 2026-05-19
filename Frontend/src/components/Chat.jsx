// Chat.jsx

import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";
import { useLocation } from "react-router";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageSender from "./MessageSender";
import ThreadPanel from "./ThreadPanel";

import { getSocket } from "../socket";

import { useAuth } from "../store/authStore";

function Chat() {

  const location = useLocation();

  const chat = location.state?.chat;

  const currentUser =
    useAuth(
      (state) =>
        state.currentUser
    );

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  const [selectedThread, setSelectedThread] = useState(null);


  // FETCH OLD MESSAGES
  useEffect(() => {
    if (!chat?._id) return;
    const getMessages = async () => {
      try {
        setLoading(true);
        let res;
        // CHANNEL
        if (chat.type === "channel") {

          res = await axios.get(
            `http://localhost:3000/message-api/get-channel/${chat._id}`,
            {
                withCredentials: true,
            }
          );
        }

          // DM
          if (chat.type === "dm") {

            res = await axios.get(
              `http://localhost:3000/message-api/get-dm/${chat._id}`,
              {
                withCredentials: true,
              }
            );
          }

          setMessages(
            res.data.payload
          );

        } catch (err) {

          console.log(err);

        } finally {

          setLoading(false);

        }
      };

    getMessages();

  }, [chat]);



  // SOCKET LISTENERS
  useEffect(() => {

    const socket = getSocket();

    if (!socket) return;

    if (!chat?._id) return;

    // JOIN CHANNEL
    if (chat.type === "channel") {

      socket.emit(
        "join-channel",
        chat._id
      );
    }

    socket.on(
      "receive-channel-message",
      (message) => {

        setMessages((prev) => [
          ...prev,
          message,
        ]);
      }
    );

    socket.on(
      "receive-message",
      (message) => {

        setMessages((prev) => [
          ...prev,
          message,
        ]);
      }
    );

    socket.on(
      "receive-dm",
      (message) => {

        setMessages((prev) => [
          ...prev,
          message,
        ]);
      }
    );

    socket.on(
      "message-edited",
      (updatedMessage) => {

        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === updatedMessage._id
              ? updatedMessage
              : msg
          )
        );
      }
    );

    socket.on(
      "reaction-updated",
      (updatedMessage) => {

        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === updatedMessage._id
              ? updatedMessage
              : msg
          )
        );
      }
    );

    socket.on(
  "receive-thread-message",
  (reply) => {

    setMessages((prev) =>
      prev.map((msg) =>

        msg._id?.toString() ===
        reply.parentMessage?.toString()

          ? {
              ...msg,
              threadCount:
                (msg.threadCount || 0) + 1,
            }

          : msg
      )
    );
  }
);

    return () => {

      socket.off("receive-channel-message");

      socket.off("receive-dm");

      socket.off("receive-message");

      socket.off("message-edited");

      socket.off("reaction-updated");

      socket.off("receive-thread-message");
    };

  }, [chat]);



  return (
  <div className="h-full flex overflow-hidden bg-[#0F1117]">
    {/* MAIN CHAT */}
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* HEADER */}
      <div className="shrink-0 border-b border-[#2A2F3A] bg-[#171A22]/95 backdrop-blur-xl shadow-lg">
        <ChatHeader chat={chat} />
      </div>
      {/* MESSAGES */}
      <div className="flex-1 min-h-0 overflow-hidden bg-[#0F1117]">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center bg-[#0F1117]">

            {/* LOADER */}
            <div className="w-12 h-12 rounded-full border-4 border-[#2A2F3A] border-t-[#4F8CFF] animate-spin mb-5"></div>

            <p className="text-[#8B94A7] text-sm font-medium tracking-wide">
              Loading messages...
            </p>
          </div>
        ) : (

          <MessageList
            messages={messages}
            currentUserId={
              currentUser?._id
            }

            openThread={
              setSelectedThread
            }
          />

        )}

      </div>

      {/* SENDER */}
      <div className="shrink-0 border-t border-[#2A2F3A] bg-[#171A22]/95 backdrop-blur-xl">

        <MessageSender
          chat={chat}
          currentUser={
            currentUser
          }
        />

      </div>

    </div>

    {/* THREAD PANEL */}
    {selectedThread && (

      <ThreadPanel
        thread={selectedThread}
        chat={chat}
        currentUser={
          currentUser
        }
        onClose={() =>
          setSelectedThread(null)
        }/>

    )}

  </div>
);
}

export default Chat;