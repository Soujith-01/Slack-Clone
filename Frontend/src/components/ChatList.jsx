import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import {
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  ghostBtn,
  loadingClass,
  errorClass,
  emptyStateClass,
  articleStatusActive,
  articleStatusDeleted,
  userInfoContainer,
  userNameText,
  userActionBtnBase,
  userActionBtnActive,
  userActionBtnInactive,
} from "../styles/common";

function ChatList() {
  const navigate = useNavigate();
  const user = useAuth((state) => state.currentUser);

  const [channelList, setchannelList] = useState([]);
  const [dmList, setdmList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!user) return;

    const getChannelList = async () => {
     
      try {
        setLoading(true)
       //read articles of current author
       let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/chat-api/chats/channels`,{withCredentials:true})
       if(res.status === 200){
        setchannelList(res.data.payload)
       }
       //update articles state

      } catch (err) {
        console.log(err);
        setError(err.response?.data?.error || "Failed to fetch Users List");
      } finally {
        setLoading(false);
      }
    };

    getChannelList();

    const getDmList = async () => {
     
      try {
        setLoading(true)
       //read articles of current author
       let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/chat-api/chats/dms`,{withCredentials:true})
       if(res.status === 200){
        setdmList(res.data.payload)
       }
       //update articles state

      } catch (err) {
        console.log(err);
        setError(err.response?.data?.error || "Failed to fetch Users List");
      } finally {
        setLoading(false);
      }
    };

    getDmList();
  }, [user]);

  

  if (loading) return <p className={loadingClass}>Loading users...</p>;
  if (error) return <p className={errorClass}>{error}</p>;

  if (dmList.length === 0 && channelList.length === 0) {
    return <div className={emptyStateClass}>No chats.</div>;
  }

  return (
  <div className="w-full max-w-sm mx-auto py-5 compact:py-4 px-3 text-[#111827] dark:text-zinc-100 transition-colors">
    
    {/* Channels */}
    <div className="mb-6 compact:mb-5">
      <div className="flex items-center justify-between mb-3 compact:mb-2.5">
        <h2 className="text-lg font-semibold text-[#111827] dark:text-zinc-100">
          Channels
        </h2>

        <button className="text-sm text-blue-600 dark:text-sky-400 hover:text-blue-700 dark:hover:text-sky-300 transition-colors">
          + New
        </button>
      </div>

      <div className="flex flex-col gap-2 compact:gap-1.5">
        {channelList.map((chat) => (
          <div
            key={chat._id}
            onClick={() => navigate(`/Chat/${chat._id}`)}
            className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl px-4 py-3 compact:px-3 compact:py-2.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <div className="flex items-center gap-3">

              {/* Channel Info */}
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-[#111827] dark:text-zinc-100">
                  #{chat.channelName}
                </p>

                <p className="text-xs text-gray-400 dark:text-zinc-400">
                  {chat.lastMessage || "No messages"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Direct Messages */}
    <div>
      <div className="flex items-center justify-between mb-3 compact:mb-2.5">
        <h2 className="text-lg font-semibold text-[#111827] dark:text-zinc-100">
          Direct Messages
        </h2>

        <button className="text-sm text-blue-600 dark:text-sky-400 hover:text-blue-700 dark:hover:text-sky-300 transition-colors">
          + New
        </button>
      </div>

      <div className="flex flex-col gap-2 compact:gap-1.5">
        {dmList.map((chat) => (
          <div
            key={chat._id}
            onClick={() => navigate(`/chat/${chat._id}`)}
            className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl px-4 py-3 compact:px-3 compact:py-2.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <div className="flex items-center justify-between">
              
              <div className="flex items-center gap-3">

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300 flex items-center justify-center font-semibold">
                  {chat.channelName?.charAt(0).toUpperCase()}
                </div>

                {/* User Info */}
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-[#111827] dark:text-zinc-100">
                    {chat.channelName}
                  </p>

                  <p className="text-xs text-gray-400 dark:text-zinc-400">
                    {chat.lastMessage || "Start chatting"}
                  </p>
                </div>
              </div>

              {/* Online Dot */}
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 dark:bg-green-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
}

export default ChatList;