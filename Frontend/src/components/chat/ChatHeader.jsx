import React from "react";
import Popup from "reactjs-popup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../store/authStore";

const BACKEND = "http://localhost:3000";

function ChatHeader({ chat }) {
  const currentUser = useAuth((state) => state.currentUser);
  const navigate = useNavigate();

  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [members, setMembers] = React.useState(chat?.members || []);

  // ✅ only reset members when a genuinely different channel is loaded
  const chatIdRef = React.useRef(chat?._id);
  React.useEffect(() => {
    if (chat?._id !== chatIdRef.current) {
      chatIdRef.current = chat?._id;
      setMembers(chat?.members || []);
    }
  }, [chat?._id, chat?.members]);

  // ✅ always fetch fresh members from backend
  const fetchMembers = async () => {
    if (!chat?._id || chat?.type === "dm") return;
    try {
      const res = await axios.get(
        `${BACKEND}/chat-api/members?channelId=${chat._id}`,
        { withCredentials: true }
      );
      setMembers(res.data.payload || []);
    } catch (err) {
      console.log(err);
    }
  };

  const isDM = chat?.type === "dm";

  const otherUser = members.find((m) => m._id !== currentUser?._id);

  const displayTitle = isDM
    ? otherUser?.username || "Direct Message"
    : `# ${chat?.channelName}`;

  const displaySubtitle = isDM
    ? "Direct Message"
    : `${members.length} members`;

  const iconLabel = isDM
    ? otherUser?.username?.charAt(0)?.toUpperCase()
    : "#";

  const isAdmin =
    (chat?.admin?._id || chat?.admin)?.toString?.() ===
    currentUser?._id?.toString();

  // =========================
  // SEND INVITE BY EMAIL
  // =========================
  const handleAddMember = async () => {
    try {
      setLoading(true);

      const res = await axios.put(
        `${BACKEND}/chat-api/add-members`,
        { channelId: chat._id, emails: [email.trim()] },
        { withCredentials: true }
      );

      // backend returns the populated channel
      setMembers(res.data.payload?.members || []);
      setEmail("");
      alert("Invite sent successfully");
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Error sending invite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <div className="border-b border-[#2A2F3A] bg-[#171A22]/95 backdrop-blur-xl px-6 py-4">
        <div className="flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#4F8CFF] to-[#3B6FD8] flex items-center justify-center text-white font-black text-lg shadow-lg">
              {iconLabel}
            </div>
            <div>
              <h1 className="text-[18px] font-bold text-[#E8ECF3]">{displayTitle}</h1>
              <p className="text-sm text-[#8B94A7]">{displaySubtitle}</p>
            </div>
          </div>

          {/* RIGHT MENU */}
          <Popup
            trigger={
              <button className="w-10 h-10 rounded-2xl hover:bg-[#232734] flex items-center justify-center text-xl text-[#B7C0CD]">
                ⋮
              </button>
            }
            position="bottom right"
            arrow={false}
            closeOnDocumentClick
            contentStyle={{ padding: "0", border: "none", background: "transparent" }}
          >
            {(close) => (
              <div className="w-52 bg-[#171A22] border border-[#2A2F3A] rounded-2xl overflow-hidden shadow-xl">

                {/* VIEW DETAILS */}
                <button
                  onClick={() => {
                    close();
                    fetchMembers(); // ✅ always fresh when opening
                    setDetailsOpen(true);
                  }}
                  className="w-full text-left px-5 py-3 hover:bg-[#232734] text-sm text-white"
                >
                  View Details
                </button>

                {/* SEARCH */}
                <button
                  onClick={() => { close(); alert("Search feature coming soon"); }}
                  className="w-full text-left px-5 py-3 hover:bg-[#232734] text-sm text-white"
                >
                  Search
                </button>

                {/* CHANNEL ACTIONS */}
                {chat?.type === "channel" && (
                  <>
                    {isAdmin ? (
                      <button
                        onClick={async () => {
                          close();
                          await axios.delete(`${BACKEND}/chat-api/delete`, {
                            data: { channelId: chat._id },
                            withCredentials: true,
                          });
                          navigate("/chat-window/", { state: { refetch: true } });
                        }}
                        className="w-full text-left px-5 py-3 hover:bg-red-500/10 text-sm text-red-400"
                      >
                        Delete Channel
                      </button>
                    ) : (
                      <button
                        onClick={async () => {
                          close();
                          await axios.post(
                            `${BACKEND}/chat-api/chats/leave`,
                            { channelId: chat._id },
                            { withCredentials: true }
                          );
                          navigate("/chat-window/", { state: { refetch: true } });
                        }}
                        className="w-full text-left px-5 py-3 hover:bg-yellow-500/10 text-sm text-yellow-400"
                      >
                        Leave Channel
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </Popup>
        </div>
      </div>

      {/* ================= SIDEBAR ================= */}
      <Popup
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        modal
        closeOnDocumentClick
        contentStyle={{
          width: "380px",
          height: "100vh",
          margin: "0",
          background: "#171A22",
          borderLeft: "1px solid #2A2F3A",
          padding: "0",
        }}
      >
        <div className="h-full flex flex-col text-white">

          {/* HEADER */}
          <div className="flex justify-between items-center px-5 py-4 border-b border-[#2A2F3A]">
            <h2 className="font-semibold">Channel Details</h2>
            <button onClick={() => setDetailsOpen(false)} className="text-[#8B94A7] hover:text-white">
              ✕
            </button>
          </div>

          {/* BODY */}
          <div className="p-5 space-y-5 overflow-y-auto">

            <div>
              <h3 className="text-lg font-bold">{displayTitle}</h3>
              <p className="text-sm text-[#8B94A7]">{isDM ? "Direct Message" : "Channel"}</p>
            </div>

            {/* MEMBERS */}
            {!isDM && (
              <div className="space-y-3">
                <p className="text-sm text-[#8B94A7]">Members ({members.length})</p>

                <div className="space-y-2">
                  {members.map((m) => (
                    <div
                      key={m._id?.toString?.() || m.email}
                      className="bg-[#232734] px-3 py-2 rounded-lg flex justify-between"
                    >
                      <div>
                        <p className="text-sm">{m.username}</p>
                        <p className="text-xs text-[#8B94A7]">{m.email}</p>
                      </div>
                      {(chat?.admin?._id || chat?.admin)?.toString() === m._id?.toString() && (
                        <span className="text-xs text-yellow-400">Admin</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* ADD MEMBER (ADMIN ONLY) */}
                {isAdmin && (
                  <div className="bg-[#232734] p-3 rounded-lg space-y-2">
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Add by email"
                      className="w-full px-3 py-2 bg-[#171A22] border border-[#2A2F3A] rounded text-sm"
                    />
                    <button
                      onClick={handleAddMember}
                      disabled={loading}
                      className="w-full py-2 bg-blue-500 rounded text-sm"
                    >
                      {loading ? "Adding..." : "Add Member"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ROLE */}
            <div className="bg-[#232734] p-3 rounded-lg">
              <p className="text-sm text-[#8B94A7]">Role</p>
              <p className="text-white">{isAdmin ? "Admin" : "Member"}</p>
            </div>

          </div>
        </div>
      </Popup>
    </>
  );
}

export default ChatHeader;