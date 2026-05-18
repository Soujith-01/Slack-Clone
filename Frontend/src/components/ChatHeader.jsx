import React, { useState } from "react";
import Popup from "reactjs-popup";

import { useAuth } from "../store/authStore";

function ChatHeader({ chat }) {

  const [open, setOpen] = useState(false);

  const currentUser =
    useAuth((state) => state.currentUser);

  // CHECK ADMIN
  const isAdmin =
    chat?.admin?.toString() ===
    currentUser?._id?.toString();

  return (
    <div className="border-b border-[#2A2F3A] bg-[#171A22]/95 backdrop-blur-xl px-6 py-4 relative">

      <div className="flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-4">

          {/* ICON */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#4F8CFF] to-[#3B6FD8] flex items-center justify-center text-white font-black text-lg shadow-lg">

            {chat?.type === "channel"
              ? "#"
              : chat?.channelName
                  ?.charAt(0)
                  ?.toUpperCase()}

          </div>

          {/* CHAT INFO */}
          <div>

            <h1 className="text-[18px] font-bold tracking-wide text-[#E8ECF3]">

              {chat?.type === "channel"
                ? `# ${chat?.channelName}`
                : chat?.channelName}

            </h1>

            <p className="text-sm text-[#8B94A7] font-medium">

              {chat?.members?.length} members

            </p>

          </div>

        </div>

        {/* RIGHT */}
        <div className="relative">

          {/* DROPDOWN BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-2xl border border-transparent hover:border-[#2A2F3A] hover:bg-[#232734] text-[#B7C0CD] hover:text-white flex items-center justify-center text-xl transition-all duration-300"
          >
            ⋮
          </button>

          {/* DROPDOWN MENU */}
          {open && (
            <div className="absolute right-0 mt-3 w-52 bg-[#171A22]/95 backdrop-blur-xl border border-[#2A2F3A] rounded-2xl shadow-2xl overflow-hidden z-50">

              {/* VIEW DETAILS */}
              <button className="w-full text-left px-5 py-3 hover:bg-[#232734] text-sm text-[#D6DCE5] font-medium transition-all duration-300">

                View Details

              </button>

              {/* SEARCH */}
              <button className="w-full text-left px-5 py-3 hover:bg-[#232734] text-sm text-[#D6DCE5] font-medium transition-all duration-300">

                Search

              </button>

              {/* DELETE / LEAVE */}
              {chat?.type === "channel" && (

                isAdmin ? (

                  <button className="w-full text-left px-5 py-3 hover:bg-red-500/10 text-sm text-red-400 font-medium transition-all duration-300">

                    Delete Channel

                  </button>

                ) : (

                  <button className="w-full text-left px-5 py-3 hover:bg-yellow-500/10 text-sm text-yellow-400 font-medium transition-all duration-300">

                    Leave Channel

                  </button>

                )
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ChatHeader;