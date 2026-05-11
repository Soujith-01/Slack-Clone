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

import { socket } from "../socket";

import { useAuth } from "../store/authStore";

function Chat() {

  const location = useLocation();

  const chat = location.state?.chat;

  const currentUser =
    useAuth(
      (state) =>
        state.currentUser
    );

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);


  // ======================================
  // FETCH OLD MESSAGES
  // ======================================
  useEffect(() => {

    if (!chat?._id) return;

    const getMessages =
      async () => {
        try {
          setLoading(true);
          let res;
          // CHANNEL
          if ( chat.type === "channel") {
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


  // ======================================
  // SOCKET LISTENERS
  // ======================================
  useEffect(() => {

    if (!chat?._id) return;

    // Join channel room
    if (
      chat.type ===
      "channel"
    ) {
      socket.emit(
        "join-channel",
        chat._id
      );
    }

    // receive channel msg
    socket.on(
      "receive-channel-message",
      (message) => {

        setMessages((prev) => [
          ...prev,
          message,
        ]);
      }
    );

    // receive dm
    socket.on(
      "receive-dm",
      (message) => {

        setMessages((prev) => [
          ...prev,
          message,
        ]);
      }
    );

    // message edited
    socket.on(
      "message-edited",
      (updatedMessage) => {

        setMessages((prev) =>
          prev.map((msg) =>
            msg._id ===
            updatedMessage._id
              ? updatedMessage
              : msg
          )
        );
      }
    );

    // reaction updated
    socket.on(
      "reaction-updated",
      (updatedMessage) => {

        setMessages((prev) =>
          prev.map((msg) =>
            msg._id ===
            updatedMessage._id
              ? updatedMessage
              : msg
          )
        );
      }
    );

    return () => {

      socket.off(
        "receive-channel-message"
      );

      socket.off(
        "receive-dm"
      );

      socket.off(
        "message-edited"
      );

      socket.off(
        "reaction-updated"
      );
    };

  }, [chat]);


  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* Header */}
      <div className="shrink-0 border-b bg-white">
        <ChatHeader chat={chat} />
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-hidden">

        {loading ? (

          <div className="h-full flex items-center justify-center">
            Loading...
          </div>

        ) : (

          <MessageList
            messages={messages}
            currentUserId={
              currentUser?._id
            }
          />
        )}
      </div>

      {/* Sender */}
      <div className="shrink-0 border-t bg-white">
        <MessageSender
          chat={chat}
          currentUser={
            currentUser
          }
        />
      </div>
    </div>
  );
}

export default Chat;