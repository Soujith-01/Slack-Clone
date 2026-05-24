import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageSender from "./MessageSender";
import ThreadPanel from "./ThreadPanel";

import { getSocket } from "../socket";
import { useAuth } from "../store/authStore";

function Chat() {
  const { state } = useLocation();
  const chat = state?.chat;

  const currentUser = useAuth((s) => s.currentUser);
  const socket = getSocket();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);

  // COPY
  const handleCopyMessage = (c) =>
    navigator.clipboard.writeText(c).catch(console.log);

  // EDIT
  const handleEditMessage = (msg) =>
    socket.emit("edit-message", {
      messageId: msg._id,
      newContent: msg.content,
    });

  // DELETE
  const handleDeleteMessage = async (msg) => {
    try {
      await axios.delete("http://localhost:3000/message-api/delete", {
        data: { messageId: msg._id },
        withCredentials: true,
      });

      setMessages((p) => p.filter((m) => m._id !== msg._id));
    } catch (e) {
      console.log(e);
    }
  };

  // UPSERT
  const upsertMessage = (msg) =>
    setMessages((prev) => {
      const exists = prev.some((m) => m._id === msg._id);
      return exists
        ? prev.map((m) => (m._id === msg._id ? msg : m))
        : [...prev, msg];
    });

  // REPLACE
  const replaceMessage = (msg) =>
    setMessages((prev) =>
      prev.map((m) => (m._id === msg._id ? msg : m))
    );

  // FETCH MESSAGES
  useEffect(() => {
    if (!chat?._id) return;

    (async () => {
      try {
        setLoading(true);

        const url =
          chat.type === "channel"
            ? `http://localhost:3000/message-api/get-channel/${chat._id}`
            : `http://localhost:3000/message-api/get-dm/${chat._id}`;

        const res = await axios.get(url, { withCredentials: true });

        // IMPORTANT: remove thread replies from main chat
        const filtered = (res.data.payload || []).filter(
          (m) => !m.parentMessage
        );

        setMessages(filtered);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [chat]);

  // SOCKETS
  useEffect(() => {
    if (!socket || !chat?._id) return;

    if (chat.type === "channel") {
      socket.emit("join-channel", chat._id);
    }

    // MAIN CHAT MESSAGE (BLOCK THREAD REPLIES)
    socket.on("receive-channel-message", (msg) => {
      if (msg.parentMessage) return;
      upsertMessage(msg);
    });

    socket.on("receive-dm", (msg) => {
      if (msg.parentMessage) return;
      upsertMessage(msg);
    });

    socket.on("message-edited", replaceMessage);
    socket.on("reaction-updated", replaceMessage);

    // THREAD EVENT (ONLY UPDATE THREAD + PARENT)
    socket.on("thread-message-received", ({ parentMessage }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === parentMessage._id ? parentMessage : m
        )
      );

      setSelectedThread((prev) =>
        prev?._id === parentMessage._id ? parentMessage : prev
      );
    });

    return () => {
      socket.off("receive-channel-message");
      socket.off("receive-dm");
      socket.off("message-edited");
      socket.off("reaction-updated");
      socket.off("thread-message-received");
    };
  }, [chat, socket]);

  return (
    <div className="h-full flex overflow-hidden bg-[#0F1117]">

      {/* CHAT */}
      <div className="flex-1 flex flex-col overflow-hidden">

        <div className="shrink-0 border-b border-[#2A2F3A] bg-[#171A22]/95">
          <ChatHeader chat={chat} />
        </div>

        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="h-full flex items-center justify-center text-[#8B94A7]">
              Loading messages...
            </div>
          ) : (
            <MessageList
              messages={messages}
              currentUserId={currentUser?._id}
              socket={socket}
              onCopyMessage={handleCopyMessage}
              onEditMessage={handleEditMessage}
              onDeleteMessage={handleDeleteMessage}
              openThread={(msg) =>
                setSelectedThread(msg)
              }
            />
          )}
        </div>

        <div className="shrink-0 border-t border-[#2A2F3A] bg-[#171A22]/95">
          <MessageSender chat={chat} currentUser={currentUser} />
        </div>

      </div>

      {/* THREAD PANEL */}
      {selectedThread && (
        <ThreadPanel
          thread={selectedThread}
          chat={chat}
          currentUser={currentUser}
          onClose={() => setSelectedThread(null)}
        />
      )}

    </div>
  );
}

export default Chat;