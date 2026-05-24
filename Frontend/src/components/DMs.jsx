import React, { useState } from "react";
import { useNavigate } from "react-router";
import Popup from "reactjs-popup";
import axios from "axios";

import {
  ChevronDown,
  Plus,
  Search,
  X,
} from "lucide-react";

function DMs({ dmList, user, unreadChatIds, clearUnread }) {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Create DM
  const createDm = async (close) => {
    try {

      setLoading(true);
      setError("");

      // find user by email
      const userRes = await axios.get(
        `http://localhost:3000/chat-api/users/search?email=${email}`,
        {
          withCredentials: true,
        }
      );

      const selectedUser = userRes.data.payload;

      // create dm
      const res = await axios.post(
        "http://localhost:3000/chat-api/chats/dm",
        {
          members: selectedUser._id,
        },
        {
          withCredentials: true,
        }
      );

      const chat = res.data.payload;

      close();

      navigate("/chat-window/Chat", {
        state: { chat },
      });

    } catch (err) {

      console.log(err);

      setError(
        err.response?.data?.message || "Failed to create DM"
      );

    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="text-[#D6DCE5]">

      {/* HEADER */}
      <div className="flex items-center justify-between bg-[#171A22] border border-[#2A2F3A] px-4 py-3 rounded-xl mb-3 shadow-lg">

        <div className="flex items-center gap-2">

          <h2 className="text-[16px] font-bold tracking-wide text-[#E7ECF5]">

            DIRECT MESSAGES

          </h2>

        </div>

      </div>



      {/* DM LIST */}
      <div className="flex flex-col gap-1.5">

        {dmList.length === 0 ? (

          <div className="px-3 py-4 text-sm text-[#8B94A7]">

            No direct messages yet

          </div>

        ) : (

          dmList.map((chat) => {

            const otherUser =
              chat.members.find(
                (member) =>
                  member._id !== user._id
              );

            return (

              <div
                  key={chat._id}

                  onClick={() => {
                    clearUnread(chat._id);
                    navigate(
                      "/chat-window/Chat",
                      {
                        state: { chat },
                      }
                    );
                  }}
                  className="group flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer border border-transparent hover:border-[#2A2F3A] hover:bg-[#171A22] transition-all duration-300"
                >

                  {/* LEFT */}
                  <div className="flex items-center gap-3 min-w-0">

                  {/* AVATAR */}
                  <div className="relative">

                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4F8CFF] to-[#3B6FD8] text-white flex items-center justify-center text-sm font-black shadow-[0_0_18px_rgba(79,140,255,0.22)]">

                      {otherUser?.username
                        ?.charAt(0)
                        .toUpperCase()}

                    </div>

                    {/* ONLINE DOT */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#111318]"></div>

                  </div>

                  {/* USERNAME */}
                  <div className="min-w-0">

                    <p className="text-[15px] font-semibold text-[#E7ECF5] truncate group-hover:text-white transition-all duration-300">

                      {otherUser?.username}

                    </p>

                    <p className="text-xs text-[#8B94A7] truncate">

                      Direct Message

                    </p>

                  </div>
                </div>

                {unreadChatIds[chat._id] && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4F8CFF] shadow-[0_0_0_4px_rgba(79,140,255,0.18)]"></span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Invite People */}
      <div className="mt-2">

        <Popup
          modal
          trigger={
            <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[#D6DCE5] hover:bg-[#171A22] hover:border-[#2A2F3A] border border-transparent transition-all duration-300 w-full">
              <Plus size={16} />

              <span className="text-[15px] font-medium">
                Invite people
              </span>
            </button>
          }
          overlayStyle={{
            background: "rgba(0,0,0,0.45)",
          }}
          contentStyle={{
            width: "420px",
            borderRadius: "14px",
            padding: "0",
            border: "1px solid #2A2F3A",
            background: "#171A22",
            overflow: "hidden",
          }}
        >
          {(close) => (
            <div className="bg-[#171A22] border border-[#2A2F3A] rounded-[18px] overflow-hidden text-[#D6DCE5]">

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2F3A]">

                <div>
                  <h2 className="text-lg font-semibold text-[#E8ECF3]">
                    Invite people
                  </h2>

                  <p className="text-sm text-[#8B94A7] mt-1">
                    Search for people to start a conversation
                  </p>
                </div>

                <button
                  onClick={close}
                  className="p-1 rounded hover:bg-[#232734] transition"
                >
                  <X size={18} className="text-[#D6DCE5]" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5">

                {/* Search Input */}
                <div className="flex items-center gap-3 border border-[#2A2F3A] rounded-lg bg-[#0F1117] px-3 py-3 focus-within:border-[#4F8CFF] transition">

                  <Search
                    size={18}
                    className="text-[#8B94A7]"
                  />

                  <input
                    type="text"
                    placeholder="name@email.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    className="w-full outline-none text-sm bg-transparent text-[#E8ECF3] placeholder:text-[#6F7888]"
                  />
                </div>

                {/* Error */}
                {error && (
                  <p className="text-red-500 text-sm mt-3">
                    {error}
                  </p>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-5">

                  <button
                    onClick={close}
                    className="px-4 py-2 rounded-lg border border-[#2A2F3A] text-sm text-[#D6DCE5] hover:bg-[#232734]"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => createDm(close)}
                    disabled={loading || !email}
                    className="px-4 py-2 rounded-lg bg-[#4F8CFF] text-white text-sm hover:bg-[#3E74DB] disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Start Chat"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </Popup>
      </div>
    </div>
  );
}

export default DMs;