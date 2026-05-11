// ChatWindow.jsx
import React from "react";
import { Outlet } from "react-router";
import ChatList from "./ChatList";

function ChatWindow() {
  return (
    <div className="h-full flex">
      
      {/* Sidebar */}
      <div className="w-[320px] border-r border-gray-200 bg-white overflow-y-auto">
        <ChatList />
      </div>

      {/* Chat Area */}
      <div className="flex-1 min-w-0 min-h-0">
        <Outlet />
      </div>

    </div>
  );
}

export default ChatWindow;