import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../store/authStore";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:3000";

function AppearanceSettings() {

  const currentUser = useAuth(
    (state) => state.currentUser
  );

  const updateCurrentUser = useAuth(
    (state) => state.updateCurrentUser
  );

  const [compactMode, setCompactMode] = useState(
    currentUser?.preferences?.compactMode ?? false
  );

  useEffect(() => {

    setCompactMode(
      currentUser?.preferences?.compactMode ?? false
    );

  }, [currentUser]);

  // apply compact mode instantly
  useEffect(() => {

    document.documentElement.classList.toggle(
      "compact",
      compactMode
    );

  }, [compactMode]);

  // update preferences
  const updatePreferences = async (
    updatedPreferences
  ) => {

    try {

      const res = await axios.put(
        `${backendUrl}/user-api/preferences`,
        updatedPreferences,
        {
          withCredentials: true,
        }
      );

      // update zustand
      updateCurrentUser(res.data.user);

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Failed to update preferences"
      );
    }
  };

  // compact mode toggle
  const handleCompactMode = async () => {

    const updatedValue = !compactMode;

    setCompactMode(updatedValue);

    await updatePreferences({
      compactMode: updatedValue,
    });
  };

  return (
    <div className="bg-[#171A22] border border-[#2A2F3A] rounded-[28px] p-7 shadow-2xl text-[#E8ECF3] transition-all duration-300">

      {/* TITLE */}
      <div className="mb-7">

        <h2 className="text-2xl font-black tracking-tight">
          Appearance Settings
        </h2>

        <p className="text-sm text-[#8B94A7] mt-2">
          Customize your workspace appearance
        </p>

      </div>

      <div className="space-y-5">

        {/* COMPACT MODE */}
        <div className="flex items-center justify-between bg-[#0F1117] border border-[#2A2F3A] rounded-2xl px-5 py-4">

          <div>

            <p className="font-semibold text-[#E8ECF3]">
              Compact Mode
            </p>

            <p className="text-sm text-[#8B94A7] mt-1">
              Reduce spacing in chats and UI
            </p>

          </div>

          <button
            onClick={handleCompactMode}
            className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
              compactMode
                ? "bg-gradient-to-r from-[#4F8CFF] to-[#3B6FD8]"
                : "bg-[#2A2F3A]"
            }`}
          >

            <div
              className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-300 ${
                compactMode
                  ? "translate-x-7"
                  : "translate-x-1"
              }`}
            />

          </button>

        </div>

      </div>

    </div>
  );
}

export default AppearanceSettings;