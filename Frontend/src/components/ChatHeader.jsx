import React, { useState } from "react";
import Popup from "reactjs-popup";

import { useAuth } from "../store/authStore";

function ChatHeader({ chat }) {

  const currentUser = useAuth((state) => state.currentUser);

  // check admin
  const isAdmin =
    chat?.admin?.toString() === currentUser?._id?.toString();

  return (
    <div className="border-b border-gray-200 bg-white px-6 py-4 relative">

      <div className="flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-3">

          {/* Chat Info */}
          <div>
            <h1 className="text-lg font-semibold text-gray-800">
              {chat?.type === "channel"
                ? `# ${chat?.channelName}`
                : chat?.channelName}
            </h1>

            <p className="text-sm text-gray-400">
              {chat?.members?.length} members
            </p>
          </div>

        </div>

        {/* Right */}
        <Popup
          trigger={
            <button
              className="w-9 h-9 rounded-lg hover:bg-gray-100 text-xl text-gray-600 flex items-center justify-center"
            >
              ⋮
            </button>
          }
          position="bottom right"
          closeOnDocumentClick
          arrow={false}
        >
          {(close) => (
            <div className="w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden py-1">

              <button
                onClick={() => close()}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm"
              >
                View Details
              </button>

              <button
                onClick={() => close()}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm"
              >
                Search
              </button>

              {chat?.type === "channel" && (
                isAdmin ? (
                  <button
                    onClick={() => close()}
                    className="w-full text-left px-4 py-3 hover:bg-red-50 text-sm text-red-600"
                  >
                    Delete Channel
                  </button>
                ) : (
                  <button
                    onClick={() => close()}
                    className="w-full text-left px-4 py-3 hover:bg-yellow-50 text-sm text-yellow-600"
                  >
                    Leave Channel
                  </button>
                )
              )}

            </div>
          )}
        </Popup>

      </div>

    </div>
  );
}

export default ChatHeader;