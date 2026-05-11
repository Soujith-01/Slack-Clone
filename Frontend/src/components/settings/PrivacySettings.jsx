import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../store/authStore";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

function PrivacySettings() {

  const currentUser = useAuth((state) => state.currentUser);
  const updateCurrentUser = useAuth((state) => state.updateCurrentUser);

  const [showOnlineStatus, setShowOnlineStatus] = useState(
    currentUser?.privacySettings?.showOnlineStatus ?? true
  );

  const [readReceipts, setReadReceipts] = useState(
    currentUser?.privacySettings?.readReceipts ?? true
  );

  useEffect(() => {
    setShowOnlineStatus(currentUser?.privacySettings?.showOnlineStatus ?? true);
    setReadReceipts(currentUser?.privacySettings?.readReceipts ?? true);
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

  const handleShowOnline = async () => {
    const updated = !showOnlineStatus;
    setShowOnlineStatus(updated);
    await updatePreferences({ showOnlineStatus: updated, readReceipts });
  };

  const handleReadReceipts = async () => {
    const updated = !readReceipts;
    setReadReceipts(updated);
    await updatePreferences({ showOnlineStatus, readReceipts: updated });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-[#e5e7eb] dark:border-zinc-800 rounded-3xl p-6 compact:p-5 shadow-sm text-[#111827] dark:text-zinc-100 transition-colors">

      <h2 className="text-2xl font-semibold mb-6 compact:mb-5">
        Privacy Settings
      </h2>

      <div className="space-y-4 compact:space-y-3">

        <div className="flex items-center justify-between">

          <p className="text-[#111827] dark:text-zinc-100">Show Online Status</p>

          <input type="checkbox" checked={showOnlineStatus} onChange={handleShowOnline} className="accent-sky-600" />

        </div>

        <div className="flex items-center justify-between">

          <p className="text-[#111827] dark:text-zinc-100">Read Receipts</p>

          <input type="checkbox" checked={readReceipts} onChange={handleReadReceipts} className="accent-sky-600" />

        </div>

      </div>
    </div>
  );
}

export default PrivacySettings;