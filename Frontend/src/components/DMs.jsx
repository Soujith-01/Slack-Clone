import React from "react";
import { useNavigate } from "react-router";
import Popup from "reactjs-popup";
import { ChevronDown, Plus, MoreVertical, Search, X } from "lucide-react";

function DMs({ dmList, user }) {
  const navigate = useNavigate();

  return (
    <div className="text-[#4a454b]">

      {/* Header */}
      <div className="flex items-center justify-between bg-[#d3d1d2] px-3 py-2 rounded-md mb-2">

        <div className="flex items-center gap-2">
          <ChevronDown size={16} />

          <h2 className="text-[17px] font-medium">
            Direct Messages
          </h2>
        </div>
      </div>

      {/* DM List */}
      <div className="flex flex-col gap-1">

        {dmList.length === 0 ? (
          <div className="px-3 text-sm text-gray-500">
            No direct messages yet
          </div>
        ) : (
          dmList.map((chat) => {

            const otherUser = chat.members.find(
              (member) => member._id !== user._id
            );

            return (
              <div
                key={chat._id}
                onClick={() =>
                  navigate("/chat-window/Chat", {
                    state: { chat },
                  })
                }
                className="flex items-center justify-between px-3 py-2 rounded-md cursor-pointer hover:bg-[#eceaea] transition"
              >
                <div className="flex items-center gap-3">

                  {/* Avatar */}
                  <div className="w-6 h-6 rounded-md bg-[#2eb67d] text-white flex items-center justify-center text-xs font-semibold">
                    {otherUser?.username?.charAt(0).toUpperCase()}
                  </div>

                  {/* Username */}
                  <p className="text-[15px] font-medium truncate">
                    {otherUser?.username}
                  </p>
                </div>

                {/* Online Dot */}
                <div className="w-2 h-2 rounded-full bg-[#2eb67d]" />
              </div>
            );
          })
        )}

      </div>
      <div className="flex items-center gap-3">

          {/* Invite People Popup */}
          <Popup
            modal
            trigger={
              <button className="flex items-center gap-3 px-3 py-2 rounded-md text-[#4a454b] hover:bg-[#eceaea] transition w-full">
                            <Plus size={16} />
              
                            <span className="text-[15px] font-medium">
                              Inivte people
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
              border: "none",
              overflow: "hidden",
            }}
          >
            {(close) => (
              <div className="bg-white">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b">

                  <div>
                    <h2 className="text-lg font-semibold text-[#1d1c1d]">
                      Invite people
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Search for people to start a conversation
                    </p>
                  </div>

                  <button
                    onClick={close}
                    className="p-1 rounded hover:bg-gray-100 transition"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Search */}
                <div className="p-5">

                  <div className="flex items-center gap-3 border rounded-lg px-3 py-3 focus-within:border-[#1264a3]">
                    <Search size={18} className="text-gray-400" />

                    <input
                      type="text"
                      placeholder="name@email.com"
                      className="w-full outline-none text-sm"
                    />
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