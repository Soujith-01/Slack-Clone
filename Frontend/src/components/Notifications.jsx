import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import axios from "axios";

import {
  Bell,
  Check,
  X,
  UserPlus2,
} from "lucide-react";

import toast from "react-hot-toast";

function Notifications() {

  const [open, setOpen] =
    useState(false);

  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const dropdownRef = useRef(null);

  const BACKEND =
    import.meta.env.VITE_BACKEND_URL ||
    "http://localhost:3000";

  // FETCH JOIN REQUESTS
  const fetchRequests =
    async () => {

      try {

        const response =
          await axios.get(
            `${BACKEND}/chat-api/chats/channels`,
            {
              withCredentials: true,
            }
          );

        const channels =
          response.data.payload || [];

        // ONLY CHANNELS WITH REQUESTS
        const filtered =
          channels.filter(
            (channel) =>
              channel.joinRequests &&
              channel.joinRequests.length > 0
          );

        setRequests(filtered);

      } catch (err) {

        console.log(err);
      }
    };

  useEffect(() => {

    fetchRequests();

  }, []);

  // CLOSE ON OUTSIDE CLICK
  useEffect(() => {

    const handleClickOutside = (
      event
    ) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target
        )
      ) {

        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  // APPROVE / REJECT
  const handleRequest =
    async (
      channelId,
      userId,
      approve
    ) => {

      try {

        setLoading(true);

        const response =
          await axios.post(
            `${BACKEND}/chat-api/chats/approve-request`,
            {
              channelId,
              userId,
              approve,
            },
            {
              withCredentials: true,
            }
          );

        toast.success(
          response.data.message
        );

        // REMOVE REQUEST FROM UI
        setRequests((prev) =>
          prev
            .map((channel) => {

              if (
                channel._id !== channelId
              ) {
                return channel;
              }

              return {
                ...channel,
                joinRequests:
                  channel.joinRequests.filter(
                    (request) =>
                      request.user?._id !==
                      userId
                  ),
              };
            })
            .filter(
              (channel) =>
                channel.joinRequests
                  .length > 0
            )
        );

      } catch (err) {

        console.log(err);

        toast.error(
          err?.response?.data
            ?.message ||
          "Something went wrong"
        );

      } finally {

        setLoading(false);
      }
    };

  // COUNT
  const totalRequests =
    requests.reduce(
      (acc, channel) =>
        acc +
        channel.joinRequests.length,
      0
    );

  return (
    <div
      className="relative"
      ref={dropdownRef}
    >

      {/* BELL BUTTON */}
      <button
        onClick={() =>
          setOpen(!open)
        }
        className="relative flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#171A22] border border-[#2A2F3A] hover:bg-[#1D212B] transition-all duration-300"
      >

        <Bell
          size={18}
          className="text-[#D6DCE5]"
        />

        <span className="text-sm font-semibold text-[#D6DCE5]">
          Notifications
        </span>

        {/* BADGE */}
        {totalRequests > 0 && (
          <div className="absolute -top-2 -right-2 min-w-[22px] h-[22px] rounded-full bg-gradient-to-r from-[#4F8CFF] to-[#3B6FD8] text-white text-xs font-bold flex items-center justify-center px-1 shadow-lg">
            {totalRequests}
          </div>
        )}

      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-4 w-[380px] bg-[#171A22] border border-[#2A2F3A] rounded-[24px] shadow-2xl overflow-hidden z-50">

          {/* HEADER */}
          <div className="px-5 py-4 border-b border-[#2A2F3A]">

            <h2 className="text-lg font-bold text-[#E8ECF3]">
              Notifications
            </h2>

            <p className="text-sm text-[#8B94A7] mt-1">
              Channel join requests
            </p>

          </div>

          {/* REQUEST LIST */}
          <div className="max-h-[450px] overflow-y-auto">

            {totalRequests === 0 ? (

              <div className="flex flex-col items-center justify-center py-14 px-6 text-center">

                <div className="w-16 h-16 rounded-full bg-[#0F1117] border border-[#2A2F3A] flex items-center justify-center mb-4">

                  <Bell
                    size={28}
                    className="text-[#4F8CFF]"
                  />

                </div>

                <h3 className="text-[#E8ECF3] font-semibold text-lg">
                  No Notifications
                </h3>

                <p className="text-sm text-[#8B94A7] mt-2">
                  You're all caught up
                </p>

              </div>

            ) : (

              requests.map((channel) => (

                <div
                  key={channel._id}
                  className="border-b border-[#232734]"
                >

                  {channel.joinRequests.map(
                    (request) => (

                      <div
                        key={
                          request.user?._id
                        }
                        className="px-5 py-4 hover:bg-[#1D212B] transition-all duration-300"
                      >

                        <div className="flex gap-4">

                          {/* AVATAR */}
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#4F8CFF] to-[#3B6FD8] flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">

                            {request.user?.username
                              ?.charAt(0)
                              ?.toUpperCase()}

                          </div>

                          {/* CONTENT */}
                          <div className="flex-1">

                            <div className="flex items-start justify-between gap-3">

                              <div>

                                <h3 className="text-[#E8ECF3] font-semibold text-sm">
                                  {
                                    request
                                      .user
                                      ?.username
                                  }
                                </h3>

                                <p className="text-[#8B94A7] text-sm mt-1 leading-relaxed">
                                  requested to join{" "}
                                  <span className="text-[#4F8CFF] font-semibold">
                                    #
                                    {
                                      channel.channelName
                                    }
                                  </span>
                                </p>

                              </div>

                              <div className="w-9 h-9 rounded-xl bg-[#0F1117] border border-[#2A2F3A] flex items-center justify-center">

                                <UserPlus2
                                  size={16}
                                  className="text-[#4F8CFF]"
                                />

                              </div>

                            </div>

                            {/* BUTTONS */}
                            <div className="flex gap-2 mt-4">

                              {/* ACCEPT */}
                              <button
                                disabled={
                                  loading
                                }
                                onClick={() =>
                                  handleRequest(
                                    channel._id,
                                    request
                                      .user
                                      ?._id,
                                    true
                                  )
                                }
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#3B6FD8] text-white font-semibold text-sm hover:opacity-90 transition-all duration-300 disabled:opacity-50"
                              >

                                <Check
                                  size={16}
                                />

                                Accept

                              </button>

                              {/* REJECT */}
                              <button
                                disabled={
                                  loading
                                }
                                onClick={() =>
                                  handleRequest(
                                    channel._id,
                                    request
                                      .user
                                      ?._id,
                                    false
                                  )
                                }
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0F1117] border border-[#2A2F3A] text-[#D6DCE5] font-semibold text-sm hover:bg-[#232734] transition-all duration-300 disabled:opacity-50"
                              >

                                <X
                                  size={16}
                                />

                                Reject

                              </button>

                            </div>

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>
              ))
            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default Notifications;