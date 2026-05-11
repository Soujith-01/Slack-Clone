import { useState } from "react";
import ProfileSettings from "../components/settings/ProfileSettings";
import SecuritySettings from "../components/settings/SecuritySettings";
import AppearanceSettings from "../components/settings/AppearanceSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import PrivacySettings from "../components/settings/PrivacySettings";
import ChatPreferences from "../components/settings/ChatPreferences";

function Settings() {

  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 compact:py-8 text-[#111827] dark:text-zinc-100">

      <div className="grid grid-cols-12 gap-6 compact:gap-5">

        {/* SIDEBAR */}
        <div className="col-span-3 bg-white dark:bg-zinc-900 border border-[#e5e7eb] dark:border-zinc-800 rounded-3xl p-4 compact:p-3 h-fit shadow-sm transition-colors">

          <button
            onClick={() => setActiveTab("profile")}
            className="w-full text-left px-4 py-3 compact:px-3 compact:py-2.5 rounded-xl text-[#111827] dark:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Profile
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className="w-full text-left px-4 py-3 compact:px-3 compact:py-2.5 rounded-xl text-[#111827] dark:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Security
          </button>

          <button
            onClick={() => setActiveTab("appearance")}
            className="w-full text-left px-4 py-3 compact:px-3 compact:py-2.5 rounded-xl text-[#111827] dark:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Appearance
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className="w-full text-left px-4 py-3 compact:px-3 compact:py-2.5 rounded-xl text-[#111827] dark:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Notifications
          </button>

          <button
            onClick={() => setActiveTab("privacy")}
            className="w-full text-left px-4 py-3 compact:px-3 compact:py-2.5 rounded-xl text-[#111827] dark:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Privacy
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className="w-full text-left px-4 py-3 compact:px-3 compact:py-2.5 rounded-xl text-[#111827] dark:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Chat Preferences
          </button>

        </div>

        {/* CONTENT */}
        <div className="col-span-9">

          {activeTab === "profile" && <ProfileSettings />}

          {activeTab === "security" && <SecuritySettings />}

          {activeTab === "appearance" && <AppearanceSettings />}

          {activeTab === "notifications" && <NotificationSettings />}

          {activeTab === "privacy" && <PrivacySettings />}

          {activeTab === "chat" && <ChatPreferences />}

        </div>
      </div>
    </div>
  );
}

export default Settings;