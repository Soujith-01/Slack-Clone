import React, { useState } from "react";
import { useNavigate } from "react-router";
import Popup from "reactjs-popup";
import axios from "axios";
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

  // FORM STATE
  const [channelName, setChannelName] = useState("");
  const [members, setMembers] = useState("");

  // ERROR STATE
  const [errorMessage, setErrorMessage] = useState("");
  const [invalidEmails, setInvalidEmails] = useState([]);

  // CREATE CHANNEL API
  const handleCreateChannel = async () => {

    // clear previous errors
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

      console.log(response.data);

      // CLOSE POPUP
      setOpenCreatePopup(false);

      // RESET FORM
      setChannelName("");
      setMembers("");

      setChannelList((prev) => [...prev,response.data.payload,]);

    } catch (err) {

      console.log(err);

      // backend message
      setErrorMessage(
        err?.response?.data?.message ||
        "Failed to create channel"
      );

      // invalid emails
      if (err?.response?.data?.invalidEmails) {
        setInvalidEmails(
          err.response.data.invalidEmails
        );
      }
    }
  };

  return (
    <div className="mb-6 text-[#4a454b]">

      {/* Header */}
      <div className="flex items-center justify-between bg-[#d3d1d2] px-3 py-2 rounded-md mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-[17px] font-medium">
            Channels
          </h2>
        </div>
      </div>

      {/* Channel List */}
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

        {/* CREATE CHANNEL CENTER POPUP */}
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

              {/* ERROR MESSAGE */}
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

      </div>
    </div>
  );
}

export default Channels;