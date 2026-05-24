// ChatWindow.jsx

import React from "react";
import { Outlet } from "react-router";
import ChatList from "./ChatList";

function ChatWindow() {

  return (

    <div className="h-full flex bg-[#0F1117] overflow-hidden">

      {/* SIDEBAR */}
      <div className="w-[340px] shrink-0 border-r border-[#2A2F3A] bg-[#111318] overflow-y-auto shadow-2xl">

        <ChatList />

      </div>

      {/* CHAT AREA */}
      <div className="flex-1 min-w-0 min-h-0 bg-[#0F1117] relative overflow-hidden">

        {/* SUBTLE BACKGROUND GLOW */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,140,255,0.08),transparent_35%)] pointer-events-none"></div>

        {/* CHAT CONTENT */}
        <div className="relative z-10 h-full">

          <Outlet />

        </div>

      </div>

    </div>
  );
}

export default ChatWindow;