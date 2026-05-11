import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../store/authStore";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

function AppearanceSettings() {

  const currentUser = useAuth(
    (state) => state.currentUser
  );

  const updateCurrentUser = useAuth(
    (state) => state.updateCurrentUser
  );

  const [darkMode, setDarkMode] = useState(
    currentUser?.preferences?.darkMode || false
  );

  const [compactMode, setCompactMode] = useState(
    currentUser?.preferences?.compactMode ?? false
  );

  useEffect(() => {
    setDarkMode(currentUser?.preferences?.darkMode ?? false);
    setCompactMode(currentUser?.preferences?.compactMode ?? false);
  }, [currentUser]);

  // apply dark mode instantly
  useEffect(() => {

    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.classList.toggle("compact", compactMode);

  }, [darkMode, compactMode]);

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

  // dark mode toggle
  const handleDarkMode = async () => {

    const updatedValue = !darkMode;

    setDarkMode(updatedValue);

    await updatePreferences({
      darkMode: updatedValue,
      compactMode,
    });
  };

  // compact mode toggle
  const handleCompactMode = async () => {

    const updatedValue = !compactMode;

    setCompactMode(updatedValue);

    await updatePreferences({
      darkMode,
      compactMode: updatedValue,
    });
  };

  return (
  <div className="bg-white dark:bg-zinc-900 border border-[#e5e7eb] dark:border-zinc-800 rounded-3xl p-6 compact:p-5 shadow-sm text-black dark:text-zinc-100 transition-colors">

    <h2 className="text-2xl font-semibold mb-6 compact:mb-5 text-[#111827] dark:text-zinc-100">
      Appearance Settings
    </h2>

    <div className="space-y-6 compact:space-y-4">

      {/* DARK MODE */}
      <div className="flex items-center justify-between">

        <div>
          <p className="font-medium text-[#111827] dark:text-zinc-100">
            Dark Mode
          </p>

          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Switch between light and dark theme
          </p>
        </div>

        <input
          type="checkbox"
          checked={darkMode}
          onChange={handleDarkMode}
          className="w-5 h-5 accent-sky-600"
        />

      </div>

      {/* COMPACT MODE */}
      <div className="flex items-center justify-between">

        <div>
          <p className="font-medium text-[#111827] dark:text-zinc-100">
            Compact Mode
          </p>

          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Reduce spacing in chats and UI
          </p>
        </div>

        <input
          type="checkbox"
          checked={compactMode}
          onChange={handleCompactMode}
          className="w-5 h-5 accent-sky-600"
        />

      </div>

    </div>
  </div>
);
}

export default AppearanceSettings;