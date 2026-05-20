import { useState } from "react";
import ProfileSettings from "../components/settings/ProfileSettings";
import SecuritySettings from "../components/settings/SecuritySettings";
import AppearanceSettings from "../components/settings/AppearanceSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import PrivacySettings from "../components/settings/PrivacySettings";
import ChatPreferences from "../components/settings/ChatPreferences";

function Settings() {

  const [activeTab, setActiveTab] =
    useState("profile");

  const tabClass = (tab) =>
    `w-full text-left px-4 py-3 rounded-2xl font-semibold transition-all duration-300 ${
      activeTab === tab
        ? "bg-gradient-to-r from-[#4F8CFF] to-[#3B6FD8] text-white shadow-lg"
        : "text-[#D6DCE5] hover:bg-[#232734]"
    }`;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-[#D6DCE5]">

      <div className="grid grid-cols-12 gap-6">

        {/* SIDEBAR */}
        <div className="col-span-3 bg-[#171A22] border border-[#2A2F3A] rounded-[30px] p-4 shadow-2xl h-fit">

          <div className="flex flex-col gap-2">

            <button
              onClick={() =>
                setActiveTab("profile")
              }
              className={tabClass("profile")}
            >
              Profile
            </button>

            <button
              onClick={() =>
                setActiveTab("security")
              }
              className={tabClass("security")}
            >
              Security
            </button>

            

            <button
              onClick={() =>
                setActiveTab("notifications")
              }
              className={tabClass("notifications")}
            >
              Notifications
            </button>

            <button
              onClick={() =>
                setActiveTab("privacy")
              }
              className={tabClass("privacy")}
            >
              Privacy
            </button>

            <button
              onClick={() =>
                setActiveTab("chat")
              }
              className={tabClass("chat")}
            >
              Chat Preferences
            </button>

          </div>
        </div>

        {/* CONTENT */}
        <div className="col-span-9">

          {activeTab === "profile" && (
            <ProfileSettings />
          )}

          {activeTab === "security" && (
            <SecuritySettings />
          )}

          {activeTab === "appearance" && (
            <AppearanceSettings />
          )}

          {activeTab === "notifications" && (
            <NotificationSettings />
          )}

          {activeTab === "privacy" && (
            <PrivacySettings />
          )}

          {activeTab === "chat" && (
            <ChatPreferences />
          )}

        </div>
      </div>
    </div>
  );
}

export default Settings;