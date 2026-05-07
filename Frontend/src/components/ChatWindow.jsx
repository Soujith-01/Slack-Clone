// ChatWindow.jsx
import React from "react";
import ChatList from "./ChatList";
import Chat from "./Chat";

function ChatWindow() {
  return (
    <div className="flex h-screen bg-[#f8f8fb]">
      
      {/* Left Sidebar */}
      <div className="w-[320px] border-r border-gray-200 bg-white">
        <ChatList />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1">
        <Chat />
      </div>

    </div>
  );
}

export default ChatWindow;