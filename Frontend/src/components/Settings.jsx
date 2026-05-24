import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import ProfileSettings from "../components/settings/ProfileSettings";
import SecuritySettings from "../components/settings/SecuritySettings";

function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  const tabClass = (tab) =>
    `w-full text-left px-4 py-3 rounded-2xl font-semibold transition-all duration-300 ${
      activeTab === tab
        ? "bg-gradient-to-r from-[#4F8CFF] to-[#3B6FD8] text-white shadow-lg"
        : "text-[#D6DCE5] hover:bg-[#232734]"
    }`;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-[#D6DCE5]">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-[#8B94A7] hover:text-[#D6DCE5] transition-colors duration-200"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="grid grid-cols-12 gap-6">

        {/* SIDEBAR */}
        <div className="col-span-3 bg-[#171A22] border border-[#2A2F3A] rounded-[30px] p-4 shadow-2xl h-fit">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab("profile")}
              className={tabClass("profile")}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={tabClass("security")}
            >
              Security
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="col-span-9">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "security" && <SecuritySettings />}
        </div>

      </div>
    </div>
  );
}

export default Settings;