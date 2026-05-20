import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Popup from "reactjs-popup";
import axios from "axios";
import toast from "react-hot-toast";

import {
  Hash,
  Plus,
  Search,
  Lock,
  X,
} from "lucide-react";

function Channels({ channelList, setChannelList, unreadChatIds, clearUnread }) {

  const navigate = useNavigate();

  // CREATE CHANNEL POPUP
  const [openCreatePopup, setOpenCreatePopup] = useState(false);

  // CREATE CHANNEL FORM
  const [channelName, setChannelName] = useState("");
  const [members, setMembers] = useState("");

  // CREATE CHANNEL ERRORS
  const [errorMessage, setErrorMessage] = useState("");
  const [invalidEmails, setInvalidEmails] = useState([]);

  // SEARCH CHANNEL POPUP
  const [openSearchPopup, setOpenSearchPopup] = useState(false);

  // SEARCH STATES
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // JOIN LOADING
  const [joining, setJoining] = useState("");

  const BACKEND =
    import.meta.env.VITE_BACKEND_URL ||
    "http://localhost:3000";

  // SEARCH CHANNELS
  const searchChannels = async (value) => {

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    try {

      setSearchLoading(true);

      const res = await axios.get(
        `${BACKEND}/chat-api/channels/search?name=${encodeURIComponent(value)}`,
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {

        setSearchResults(
          Array.isArray(res.data.payload)
            ? res.data.payload
            : []
        );
      }

    } catch (err) {

      console.log(err);

    } finally {

      setSearchLoading(false);
    }
  };

  // SEARCH DEBOUNCE
  useEffect(() => {

    const timer = setTimeout(() => {

      if (searchTerm.trim()) {

        searchChannels(searchTerm);

      } else {

        setSearchResults([]);
      }

    }, 400);

    return () => clearTimeout(timer);

  }, [searchTerm]);

  // JOIN CHANNEL
  const handleJoinChannel = async (channelId) => {

    try {

      setJoining(channelId);

      const res = await axios.post(
        `${BACKEND}/chat-api/chats/join-request`,
        {
          channelId,
        },
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {

        toast.success("Join request sent to admin");

        setSearchResults((prev) =>
          prev.map((channel) =>
            channel._id === channelId
              ? {
                  ...channel,
                  requested: true,
                }
              : channel
          )
        );
      }

    } catch (err) {

      console.log(err);

      toast.error(
        err?.response?.data?.message ||
        "Failed to send request"
      );

    } finally {

      setJoining("");
    }
  };

  // CREATE CHANNEL
  const handleCreateChannel = async () => {

    // CLEAR ERRORS
    setErrorMessage("");
    setInvalidEmails([]);

    const payload = {
      type: "channel",
      channelName,
      members: members
        .split(",")
        .map((m) => m.trim())
        .filter((m) => m !== ""),
    };

    try {

      const response = await axios.post(
        `${BACKEND}/chat-api/chats/channel`,
        payload,
        {
          withCredentials: true,
        }
      );

      setOpenCreatePopup(false);

      setChannelName("");
      setMembers("");

      setChannelList((prev) => [
        ...prev,
        response.data.payload,
      ]);

      toast.success("Channel created");

    } catch (err) {

      console.log(err);

      setErrorMessage(
        err?.response?.data?.message ||
        "Failed to create channel"
      );

      if (err?.response?.data?.invalidEmails) {

        setInvalidEmails(
          err.response.data.invalidEmails
        );
      }
    }
  };

  return (
    <div className="mb-6 text-[#D6DCE5]">

      {/* HEADER */}
      <div className="flex items-center justify-between bg-[#171A22] border border-[#2A2F3A] px-4 py-3 rounded-2xl mb-3 shadow-lg">

        <div className="flex items-center gap-2">

          <h2 className="text-[17px] font-bold uppercase tracking-wide text-[#E8ECF3]">
            Channels
          </h2>

        </div>
      </div>

      {/* CHANNEL LIST */}
      <div className="flex flex-col gap-1">

        {channelList.length === 0 ? (

          <div className="px-3 text-sm text-[#8B94A7]">
            No channels yet
          </div>

        ) : (

          channelList.map((chat) => (

            <div
              key={chat._id}
              onClick={() => {
                clearUnread(chat._id);
                navigate("/chat-window/Chat", {
                  state: { chat },
                });
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 border ${
                chat.channelName === "plan"
                  ? "bg-gradient-to-r from-[#4F8CFF] to-[#3B6FD8] border-[#5A8FFF]/30 text-white shadow-lg"
                  : "border-transparent hover:border-[#2A2F3A] hover:bg-[#171A22] text-[#D6DCE5]"
              }`}
            >

              {chat.channelName === "plan" ? (
                <Lock size={16} />
              ) : (
                <Hash size={16} />
              )}

              <div className="flex items-center gap-2 min-w-0">
                <p className="text-[15px] font-semibold truncate tracking-wide">
                  {chat.channelName}
                </p>

                {unreadChatIds[chat._id] && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4F8CFF] shadow-[0_0_0_4px_rgba(79,140,255,0.18)]"></span>
                )}
              </div>

            </div>
          ))
        )}

        {/* ADD CHANNEL MENU */}
        <Popup
          trigger={
            <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[#D6DCE5] hover:bg-[#171A22] hover:border-[#2A2F3A] border border-transparent transition-all duration-300 w-full">

              <Plus size={17} />

              <span className="text-[15px] font-semibold tracking-wide">
                Add channels
              </span>

            </button>
          }
          position="right top"
          arrow={false}
          closeOnDocumentClick
          contentStyle={{
            width: "240px",
            background: "#171A22",
            border: "1px solid #2A2F3A",
            borderRadius: "18px",
            padding: "10px",
            boxShadow:
              "0 20px 40px rgba(0,0,0,0.45)",
            backdropFilter: "blur(18px)",
          }}
        >
          {(close) => (
            <div className="flex flex-col gap-1 text-[#D6DCE5]">

              {/* CREATE CHANNEL */}
              <button
                onClick={() => {
                  close();
                  setOpenCreatePopup(true);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[#232734] transition-all duration-300 text-left"
              >

                <Plus size={16} />

                <span className="text-sm font-semibold">
                  Create new channel
                </span>

              </button>

              {/* SEARCH CHANNEL */}
              <button
                onClick={() => {
                  close();
                  setOpenSearchPopup(true);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[#232734] transition-all duration-300 text-left"
              >

                <Search size={16} />

                <span className="text-sm font-semibold">
                  Search channels
                </span>

              </button>

            </div>
          )}
        </Popup>

        {/* CREATE CHANNEL POPUP */}
        <Popup
          open={openCreatePopup}
          modal
          closeOnDocumentClick
          onClose={() => setOpenCreatePopup(false)}
        >
          {(close) => (
            <div className="bg-[#171A22] border border-[#2A2F3A] w-[430px] rounded-[28px] p-7 shadow-2xl relative text-[#E8ECF3]">

              {/* CLOSE BUTTON */}
              <button
                onClick={() => {
                  close();
                  setOpenCreatePopup(false);
                }}
                className="absolute top-5 right-5 text-[#8B94A7] hover:text-white transition"
              >
                <X size={20} />
              </button>

              {/* TITLE */}
              <h2 className="text-3xl font-black tracking-tight mb-2">
                Create Channel
              </h2>

              <p className="text-sm text-[#8B94A7] mb-7">
                Create a new channel for your workspace
              </p>

              {/* ERROR */}
              {errorMessage && (
                <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-2xl text-sm">
                  {errorMessage}
                </div>
              )}

              {/* INVALID EMAILS */}
              {invalidEmails.length > 0 && (
                <div className="mb-4 bg-red-500/5 border border-red-500/20 rounded-2xl p-4">

                  <p className="text-sm font-semibold text-red-300 mb-3">
                    Invalid Emails:
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {invalidEmails.map((email, index) => (

                      <span
                        key={index}
                        className="bg-red-500/10 text-red-300 text-xs px-3 py-1 rounded-xl border border-red-500/20"
                      >
                        {email}
                      </span>
                    ))}

                  </div>
                </div>
              )}

              {/* CHANNEL NAME */}
              <div className="mb-5">

                <label className="block text-sm font-semibold mb-2 text-[#D6DCE5]">
                  Channel Name
                </label>

                <input
                  type="text"
                  placeholder="eg. development"
                  value={channelName}
                  onChange={(e) =>
                    setChannelName(e.target.value)
                  }
                  className="w-full bg-[#0F1117] border border-[#2A2F3A] rounded-2xl px-4 py-3 outline-none focus:border-[#4F8CFF] text-[#E8ECF3] placeholder:text-[#6F7888] transition-all duration-300"
                />

              </div>

              {/* MEMBERS */}
              <div className="mb-7">

                <label className="block text-sm font-semibold mb-2 text-[#D6DCE5]">
                  Member Emails
                </label>

                <input
                  type="text"
                  placeholder="abc@gmail.com, xyz@gmail.com"
                  value={members}
                  onChange={(e) =>
                    setMembers(e.target.value)
                  }
                  className="w-full bg-[#0F1117] border border-[#2A2F3A] rounded-2xl px-4 py-3 outline-none focus:border-[#4F8CFF] text-[#E8ECF3] placeholder:text-[#6F7888] transition-all duration-300"
                />

                <p className="text-xs text-[#8B94A7] mt-2">
                  Enter emails separated by commas
                </p>

              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3">

                <button
                  onClick={() => {
                    close();
                    setOpenCreatePopup(false);
                  }}
                  className="px-5 py-2.5 rounded-2xl border border-[#2A2F3A] bg-[#0F1117] hover:bg-[#232734] transition-all duration-300 text-[#D6DCE5] font-semibold"
                >
                  Cancel
                </button>

                <button
                  onClick={handleCreateChannel}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#4F8CFF] to-[#3B6FD8] text-white hover:opacity-90 transition-all duration-300 font-semibold shadow-lg"
                >
                  Create Channel
                </button>

              </div>
            </div>
          )}
        </Popup>

        {/* SEARCH CHANNEL POPUP */}
        <Popup
          open={openSearchPopup}
          modal
          closeOnDocumentClick
          onClose={() => {
            setOpenSearchPopup(false);
            setSearchResults([]);
            setSearchTerm("");
          }}
        >
          {(close) => (

            <div className="bg-[#171A22] w-[500px] rounded-2xl p-6 shadow-2xl relative text-[#D6DCE5] border border-[#2A2F3A]">

              {/* CLOSE BUTTON */}
              <button
                onClick={() => {
                  close();
                  setOpenSearchPopup(false);
                  setSearchResults([]);
                  setSearchTerm("");
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
              >
                <X size={20} />
              </button>

              {/* TITLE */}
              <h2 className="text-2xl font-semibold mb-2 text-[#E8ECF3]">
                Search Channels
              </h2>

              <p className="text-sm text-[#8B94A7] mb-6">
                Search and join channels in your workspace
              </p>

              {/* SEARCH INPUT */}
              <div className="mb-5">

                <div className="flex items-center gap-3 border border-[#2A2F3A] rounded-xl bg-[#0F1117] px-4 py-3 focus-within:border-[#4F8CFF] transition">

                  <Search
                    size={18}
                    className="text-[#8B94A7]"
                  />

                  <input
                    type="text"
                    autoFocus
                    placeholder="Search channel name..."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value)
                    }
                    className="w-full outline-none text-sm bg-transparent text-[#E8ECF3] placeholder:text-[#6F7888]"
                  />
                </div>
              </div>

              {/* LOADING */}
              {searchLoading && (

                <div className="text-sm text-[#8B94A7] mb-4">
                  Searching channels...
                </div>
              )}

              {/* EMPTY STATE */}
              {!searchLoading &&
                searchTerm &&
                searchResults.length === 0 && (

                <div className="text-sm text-[#8B94A7] text-center py-8">
                  No channels found
                </div>
              )}

              {/* RESULTS */}
              <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto">

                {searchResults.map((channel) => (

                  <div
                    key={channel._id}
                    className="border border-[#2A2F3A] rounded-xl px-4 py-3 hover:bg-[#232734] transition"
                  >

                    <div className="flex items-center justify-between">

                      {/* LEFT */}
                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-[#0F1117] border border-[#2A2F3A] flex items-center justify-center">

                          <Hash size={18} className="text-[#8B94A7]" />

                        </div>

                        <div>

                          <p className="font-medium text-[15px] text-[#E8ECF3]">
                            #{channel.channelName}
                          </p>

                          <p className="text-xs text-[#8B94A7]">
                            {channel.members?.length || 0}
                            {" members"}
                          </p>

                        </div>
                      </div>

                      {/* JOIN BUTTON */}
                      <button
                        disabled={
                          joining === channel._id ||
                          channel.requested
                        }
                        onClick={() =>
                          handleJoinChannel(channel._id)
                        }
                        className="px-4 py-2 rounded-lg bg-[#4F8CFF] text-white text-sm hover:opacity-90 transition disabled:opacity-50"
                      >
                        {joining === channel._id
                          ? "Sending..."
                          : channel.requested
                          ? "Requested"
                          : "Join"}
                      </button>

                    </div>
                  </div>
                ))}
              </div>

              {/* FOOTER */}
              <div className="flex justify-end mt-6">

                <button
                  onClick={() => {
                    close();
                    setOpenSearchPopup(false);
                    setSearchResults([]);
                    setSearchTerm("");
                  }}
                  className="px-4 py-2 rounded-lg border border-[#2A2F3A] text-[#D6DCE5] hover:bg-[#232734] transition"
                >
                  Close
                </button>

              </div>
            </div>
          )}
        </Popup>

      </div>
    </div>
  );
}

export default Channels;