import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../store/authStore";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

function NotificationSettings() {

  const currentUser = useAuth((state) => state.currentUser);
  const updateCurrentUser = useAuth((state) => state.updateCurrentUser);

  const [soundNotifications, setSoundNotifications] = useState(
    currentUser?.notificationSettings?.soundNotifications ?? true
  );

  const [desktopNotifications, setDesktopNotifications] = useState(
    currentUser?.notificationSettings?.desktopNotifications ?? true
  );

  useEffect(() => {
    setSoundNotifications(currentUser?.notificationSettings?.soundNotifications ?? true);
    setDesktopNotifications(currentUser?.notificationSettings?.desktopNotifications ?? true);
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

  const handleSound = async () => {
    const updated = !soundNotifications;
    setSoundNotifications(updated);
    await updatePreferences({ soundNotifications: updated, desktopNotifications });
  };

  const handleDesktop = async () => {
    const updated = !desktopNotifications;
    setDesktopNotifications(updated);
    await updatePreferences({ soundNotifications, desktopNotifications: updated });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-[#e5e7eb] dark:border-zinc-800 rounded-3xl p-6 compact:p-5 shadow-sm text-[#111827] dark:text-zinc-100 transition-colors">

      <h2 className="text-2xl font-semibold mb-6 compact:mb-5">
        Notification Settings
      </h2>

      <div className="space-y-4 compact:space-y-3">

        <div className="flex items-center justify-between">

          <p className="text-[#111827] dark:text-zinc-100">Sound Notifications</p>

          <input type="checkbox" checked={soundNotifications} onChange={handleSound} className="accent-sky-600" />

        </div>

        <div className="flex items-center justify-between">

          <p className="text-[#111827] dark:text-zinc-100">Desktop Notifications</p>

          <input type="checkbox" checked={desktopNotifications} onChange={handleDesktop} className="accent-sky-600" />

        </div>

      </div>
    </div>
  );
}

export default NotificationSettings;