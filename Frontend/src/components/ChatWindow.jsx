// ChatWindow.jsx
import React from "react";
import ChatList from "./ChatList";
import Chat from "./Chat";

function ChatWindow() {
  return (
    <div className="flex h-screen bg-[#f8f8fb] dark:bg-zinc-950 text-[#111827] dark:text-zinc-100 transition-colors">
      
      {/* Left Sidebar */}
      <div className="w-[320px] border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors">
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