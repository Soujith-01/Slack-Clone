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

  const [chatList, setchatList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!user) return;

    const getChatList = async () => {
     
      try {
        setLoading(true)
       //read articles of current author
       let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/chat-api/chats`,{withCredentials:true})
       if(res.status === 200){
        setchatList(res.data.payload)
       }
       //update articles state

      } catch (err) {
        console.log(err);
        setError(err.response?.data?.error || "Failed to fetch Users List");
      } finally {
        setLoading(false);
      }
    };

    getChatList();
  }, [user]);

  

  if (loading) return <p className={loadingClass}>Loading users...</p>;
  if (error) return <p className={errorClass}>{error}</p>;

  if (chatList.length === 0) {
    return <div className={emptyStateClass}>No chats.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-5">
      {chatList.map((chat) => (
        <div key={chat._id} className={`${articleCardClass} relative flex flex-col my-5`}>
          {/* Status Badge */}
          <div className={userInfoContainer}>
            <p className={userNameText}>
              {chat.channelName}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatList;