import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useLocation } from "react-router";
import { useAuth } from "../store/authStore";
import { getSocket } from "../socket";

import Channels from "./Channels";
import DMs from "./DMs";

function ChatList() {

  const user = useAuth((state) => state.currentUser);

  const [channelList, setchannelList] = useState([]);
  const [dmList, setdmList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadChatIds, setUnreadChatIds] = useState({});

  const location = useLocation();
  const activeChatId = location.state?.chat?._id;

  // =========================
  // FETCH CHATS
  // =========================
  const fetchChats = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);

      const [channelsRes, dmsRes] = await Promise.all([
        axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/chat-api/chats/channels`,
          { withCredentials: true }
        ),
        axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/chat-api/chats/dms`,
          { withCredentials: true }
        ),
      ]);

      setchannelList(channelsRes.data.payload);
      setdmList(dmsRes.data.payload);

    } catch (err) {
      console.log(err);
      setError(err.response?.data?.error || "Failed to fetch chats");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // initial fetch
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // ✅ refetch when ChatHeader navigates back with { refetch: true }
  useEffect(() => {
    if (location.state?.refetch) {
      fetchChats();
    }
  }, [location.state?.refetch]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleDm = (message) => {
      const senderId = message.sender?._id;
      if (!senderId) return;

      const matchingChat = dmList.find((chat) =>
        chat.members.some(
          (member) => member._id === senderId && member._id !== user?._id
        )
      );

      if (!matchingChat) return;
      if (matchingChat._id === activeChatId) return;

      setUnreadChatIds((prev) => ({ ...prev, [matchingChat._id]: true }));
    };

    const handleChannel = (message) => {
      const channelId = message.channel;
      if (!channelId) return;
      if (channelId === activeChatId) return;
      setUnreadChatIds((prev) => ({ ...prev, [channelId]: true }));
    };

    socket.on("receive-dm", handleDm);
    socket.on("receive-channel-message", handleChannel);
    socket.on("receive-message", handleChannel);

    return () => {
      socket.off("receive-dm", handleDm);
      socket.off("receive-channel-message", handleChannel);
      socket.off("receive-message", handleChannel);
    };
  }, [activeChatId, dmList, user?._id]);

  const clearUnread = (chatId) => {
    if (!chatId) return;
    setUnreadChatIds((prev) => {
      const next = { ...prev };
      delete next[chatId];
      return next;
    });
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#111318]">
        <div className="w-12 h-12 rounded-full border-4 border-[#2B2F3A] border-t-[#4F8CFF] animate-spin mb-5"></div>
        <p className="text-[#8B94A7] text-sm font-medium tracking-wide">
          Loading conversations...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-[#111318] px-6">
        <div className="bg-[#171A22] border border-red-500/20 rounded-3xl px-6 py-5 text-center shadow-xl">
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#111318] border-r border-[#2A2F3A] overflow-y-auto">

      {/* USER PROFILE */}
      <div className="px-4 pt-5 pb-4">
        <div className="bg-[#171A22] border border-[#2A2F3A] rounded-3xl px-4 py-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4F8CFF] to-[#3B6FD8] text-white flex items-center justify-center font-black text-lg shadow-[0_0_20px_rgba(79,140,255,0.25)]">
                {user?.username?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#171A22]"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[15px] font-bold text-[#E7ECF5] truncate">
                {user?.username}
              </h2>
              <p className="text-xs text-[#8B94A7] truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* CHAT LIST */}
      <div className="px-3 pb-6">
        <Channels
          channelList={channelList}
          setChannelList={setchannelList}
          unreadChatIds={unreadChatIds}
          clearUnread={clearUnread}
        />
        <DMs
          dmList={dmList}
          user={user}
          unreadChatIds={unreadChatIds}
          clearUnread={clearUnread}
        />
      </div>

    </div>
  );
}

export default ChatList;