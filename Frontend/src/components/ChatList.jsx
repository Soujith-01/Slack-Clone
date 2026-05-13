import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";

import Channels from "./Channels";
import DMs from "./DMs";

function ChatList() {
  const user = useAuth((state) => state.currentUser);

  const [channelList, setchannelList] = useState([]);
  const [dmList, setdmList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchChats = async () => {
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
    };

    fetchChats();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-full max-w-sm mx-auto py-5 px-3">
      
      <Channels channelList={channelList} setChannelList={setchannelList} />

      <DMs dmList={dmList} user={user} />

    </div>
  );
}

export default ChatList;