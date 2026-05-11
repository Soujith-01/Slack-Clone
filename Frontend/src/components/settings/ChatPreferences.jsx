import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../store/authStore";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

function ChatPreferences() {

  const currentUser = useAuth((state) => state.currentUser);
  const updateCurrentUser = useAuth((state) => state.updateCurrentUser);

  const [enterToSend, setEnterToSend] = useState(
    currentUser?.chatPreferences?.enterToSend ?? true
  );

  const [showTypingIndicators, setShowTypingIndicators] = useState(
    currentUser?.chatPreferences?.showTypingIndicators ?? true
  );

  useEffect(() => {
    setEnterToSend(currentUser?.chatPreferences?.enterToSend ?? true);
    setShowTypingIndicators(currentUser?.chatPreferences?.showTypingIndicators ?? true);
  }, [currentUser]);

  const updatePreferences = async (payload) => {
    try {
      const res = await axios.put(`${backendUrl}/user-api/preferences`, payload, { withCredentials: true });
      updateCurrentUser(res.data.user);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update preferences");
    }
  };

  const handleEnterToSend = async () => {
    const updated = !enterToSend;
    setEnterToSend(updated);
    await updatePreferences({ enterToSend: updated, showTypingIndicators });
  };

  const handleTypingIndicators = async () => {
    const updated = !showTypingIndicators;
    setShowTypingIndicators(updated);
    await updatePreferences({ enterToSend, showTypingIndicators: updated });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-[#e5e7eb] dark:border-zinc-800 rounded-3xl p-6 compact:p-5 shadow-sm text-[#111827] dark:text-zinc-100 transition-colors">

      <h2 className="text-2xl font-semibold mb-6 compact:mb-5">
        Chat Preferences
      </h2>

      <div className="space-y-4 compact:space-y-3">

        <div className="flex items-center justify-between">

          <p className="text-[#111827] dark:text-zinc-100">Enter To Send</p>

          <input type="checkbox" checked={enterToSend} onChange={handleEnterToSend} className="accent-sky-600" />

        </div>

        <div className="flex items-center justify-between">

          <p className="text-[#111827] dark:text-zinc-100">Show Typing Indicators</p>

          <input type="checkbox" checked={showTypingIndicators} onChange={handleTypingIndicators} className="accent-sky-600" />

        </div>

      </div>
    </div>
  );
}

export default ChatPreferences;