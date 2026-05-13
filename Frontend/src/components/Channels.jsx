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

function Channels({ channelList, setChannelList }) {

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
  const [joining, setJoining] = useState(false);
  // SEARCH CHANNELS
  const searchChannels = async (value) => {

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    try {

      setSearchLoading(true);

      const res = await axios.get(
        `http://localhost:3000/chat-api/channels/search?name=${encodeURIComponent(value)}`,
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setSearchResults(
          Array.isArray(res.data.payload)
            ? res.data.payload
            : res.data.payload
              ? [res.data.payload]
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

      setJoining(true);

      const res = await axios.post(
        `http://localhost:3000/chat-api/channels/join-request/${channelId}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {

       toast.success("Join request sent");

        setOpenSearchPopup(false);

        setSearchResults([]);
        setSearchTerm("");
      }

    } catch (err) {

      console.log(err);

    } finally {

      setJoining(false);
    }
  };


  // CREATE CHANNEL
  const handleCreateChannel = async () => {

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
        "http://localhost:3000/chat-api/chats/channel",
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
    <div className="mb-6 text-[#4a454b]">

      {/* HEADER */}
      <div className="flex items-center justify-between bg-[#d3d1d2] px-3 py-2 rounded-md mb-2">

        <div className="flex items-center gap-2">

          <h2 className="text-[17px] font-medium">
            Channels
          </h2>

        </div>
      </div>

      {/* CHANNEL LIST */}
      <div className="flex flex-col gap-1">

        {channelList.length === 0 ? (

          <div className="px-3 text-sm text-gray-500">
            No channels yet
          </div>

        ) : (

          channelList.map((chat) => (

            <div
              key={chat._id}
              onClick={() =>
                navigate("/chat-window/Chat", {
                  state: { chat },
                })
              }
              className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition ${
                chat.channelName === "plan"
                  ? "bg-[#3b373c] text-white"
                  : "hover:bg-[#eceaea]"
              }`}
            >

              {chat.channelName === "plan" ? (
                <Lock size={16} />
              ) : (
                <Hash size={16} />
              )}

              <p className="text-[15px] font-medium truncate">
                {chat.channelName}
              </p>

            </div>
          ))
        )}

        {/* ADD CHANNEL MENU */}
        <Popup
          trigger={
            <button className="flex items-center gap-3 px-3 py-2 rounded-md text-[#4a454b] hover:bg-[#eceaea] transition w-full">

              <Plus size={16} />

              <span className="text-[15px] font-medium">
                Add channels
              </span>

            </button>
          }
          position="right top"
          arrow={false}
          closeOnDocumentClick
          contentStyle={{
            width: "220px",
            background: "#ffffff",
            border: "1px solid #d4d4d4",
            borderRadius: "10px",
            padding: "8px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}
        >
          {(close) => (

            <div className="flex flex-col gap-1 text-[#3b373c]">

              {/* CREATE CHANNEL */}
              <button
                onClick={() => {
                  close();
                  setOpenCreatePopup(true);
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#f1f1f1] transition text-left"
              >

                <Plus size={16} />

                <span className="text-sm font-medium">
                  Create new channel
                </span>

              </button>

              {/* SEARCH CHANNEL */}
              <button
                onClick={() => {
                  close();
                  setOpenSearchPopup(true);
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#f1f1f1] transition text-left"
              >

                <Search size={16} />

                <span className="text-sm font-medium">
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

            <div className="bg-white w-[420px] rounded-2xl p-6 shadow-2xl relative">

              {/* CLOSE BUTTON */}
              <button
                onClick={() => {
                  close();
                  setOpenCreatePopup(false);
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-black"
              >
                <X size={20} />
              </button>

              {/* TITLE */}
              <h2 className="text-2xl font-semibold mb-2">
                Create Channel
              </h2>

              <p className="text-sm text-gray-500 mb-6">
                Create a new channel for your workspace
              </p>

              {/* ERROR */}
              {errorMessage && (

                <div className="mb-4 bg-red-100 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {errorMessage}
                </div>
              )}

              {/* INVALID EMAILS */}
              {invalidEmails.length > 0 && (

                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">

                  <p className="text-sm font-medium text-red-600 mb-2">
                    Invalid Emails:
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {invalidEmails.map((email, index) => (

                      <span
                        key={index}
                        className="bg-red-200 text-red-700 text-xs px-2 py-1 rounded-md"
                      >
                        {email}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CHANNEL NAME */}
              <div className="mb-4">

                <label className="block text-sm font-medium mb-2">
                  Channel Name
                </label>

                <input
                  type="text"
                  placeholder="eg. development"
                  value={channelName}
                  onChange={(e) =>
                    setChannelName(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
                />
              </div>

              {/* MEMBERS */}
              <div className="mb-6">

                <label className="block text-sm font-medium mb-2">
                  Member Emails
                </label>

                <input
                  type="text"
                  placeholder="abc@gmail.com, xyz@gmail.com"
                  value={members}
                  onChange={(e) =>
                    setMembers(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
                />

                <p className="text-xs text-gray-500 mt-2">
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
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleCreateChannel}
                  className="px-5 py-2 rounded-lg bg-black text-white hover:opacity-90 transition"
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

            <div className="bg-white w-[500px] rounded-2xl p-6 shadow-2xl relative">

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
              <h2 className="text-2xl font-semibold mb-2">
                Search Channels
              </h2>

              <p className="text-sm text-gray-500 mb-6">
                Search and join channels in your workspace
              </p>

              {/* SEARCH INPUT */}
              <div className="mb-5">

                <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-3 focus-within:border-black transition">

                  <Search
                    size={18}
                    className="text-gray-400"
                  />

                  <input
                    type="text"
                    autoFocus
                    placeholder="Search channel name..."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value)
                    }
                    className="w-full outline-none text-sm"
                  />
                </div>
              </div>

              {/* LOADING */}
              {searchLoading && (

                <div className="text-sm text-gray-500 mb-4">
                  Searching channels...
                </div>
              )}

              {/* EMPTY STATE */}
              {!searchLoading &&
                searchTerm &&
                searchResults.length === 0 && (

                <div className="text-sm text-gray-500 text-center py-8">
                  No channels found
                </div>
              )}

              {/* RESULTS */}
              <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto">

                {searchResults.map((channel) => (

                  <div
                    key={channel._id}
                    className="border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50 transition"
                  >

                    <div className="flex items-center justify-between">

                      {/* LEFT */}
                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">

                          <Hash size={18} />

                        </div>

                        <div>

                          <p className="font-medium text-[15px]">
                            #{channel.channelName}
                          </p>

                          <p className="text-xs text-gray-500">
                            {channel.members?.length || 0}
                            {" / "}
                            {channel.maxMembers || 50}
                            {" "}members
                          </p>
                        </div>
                      </div>

                      {/* JOIN BUTTON */}
                      <button
                        disabled={joining}
                        onClick={() =>
                          handleJoinChannel(channel._id)
                        }
                        className="px-4 py-2 rounded-lg bg-black text-white text-sm hover:opacity-90 transition disabled:opacity-50"
                      >
                        {joining ? "Joining..." : "Join"}
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
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
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