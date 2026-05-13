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
              onClick={() =>
                navigate("/chat-window/Chat", {
                  state: { chat },
                })
              }
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

              <p className="text-[15px] font-semibold truncate tracking-wide">
                {chat.channelName}
              </p>

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

      </div>
    </div>
  );
}

export default Channels; 