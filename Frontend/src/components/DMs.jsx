import React from "react";
import { useNavigate } from "react-router";
import Popup from "reactjs-popup";

import {
  ChevronDown,
  Plus,
  Search,
  X,
} from "lucide-react";

function DMs({ dmList, user }) {

  const navigate = useNavigate();

  return (

    <div className="text-[#D6DCE5]">

      {/* HEADER */}
      <div className="flex items-center justify-between bg-[#171A22] border border-[#2A2F3A] px-4 py-3 rounded-2xl mb-3 shadow-lg">

        <div className="flex items-center gap-2">

          <ChevronDown
            size={16}
            className="text-[#8B94A7]"
          />

          <h2 className="text-[16px] font-bold tracking-wide text-[#E7ECF5]">

            Direct Messages

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

                onClick={() =>
                  navigate(
                    "/chat-window/Chat",
                    {
                      state: { chat },
                    }
                  )
                }

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

              </div>
            );
          })
        )}

      </div>



      {/* INVITE PEOPLE */}
      <div className="mt-3">

        <Popup
          modal

          trigger={

            <button className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-dashed border-[#2A2F3A] text-[#AEB8C7] hover:text-white hover:border-[#4F8CFF]/50 hover:bg-[#171A22] transition-all duration-300 w-full">

              <Plus size={17} />

              <span className="text-[15px] font-semibold">

                Invite people

              </span>

            </button>
          }

          overlayStyle={{
            background:
              "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
          }}

          contentStyle={{
            width: "430px",
            borderRadius: "24px",
            padding: "0",
            border: "1px solid #2A2F3A",
            overflow: "hidden",
            background: "#171A22",
            boxShadow:
              "0 0 50px rgba(0,0,0,0.45)",
          }}
        >

          {(close) => (

            <div className="bg-[#171A22]">

              {/* HEADER */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#2A2F3A]">

                <div>

                  <h2 className="text-[20px] font-bold text-[#E7ECF5] tracking-wide">

                    Invite people

                  </h2>

                  <p className="text-sm text-[#8B94A7] mt-1">

                    Search for people to start a conversation

                  </p>

                </div>

                <button
                  onClick={close}
                  className="w-9 h-9 rounded-xl bg-[#111318] hover:bg-[#232734] text-[#9AA4B2] hover:text-white flex items-center justify-center transition-all duration-300"
                >

                  <X size={18} />

                </button>

              </div>



              {/* SEARCH */}
              <div className="p-6">

                <div className="flex items-center gap-3 bg-[#111318] border border-[#2A2F3A] rounded-2xl px-4 py-4 focus-within:border-[#4F8CFF] focus-within:shadow-[0_0_20px_rgba(79,140,255,0.15)] transition-all duration-300">

                  <Search
                    size={18}
                    className="text-[#8B94A7]"
                  />

                  <input
                    type="text"
                    placeholder="name@email.com"
                    className="w-full bg-transparent outline-none text-sm text-[#E7ECF5] placeholder:text-[#6F7887]"
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