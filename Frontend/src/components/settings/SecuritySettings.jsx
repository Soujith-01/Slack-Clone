import axios from "axios";
import { useAuth } from "../../store/authStore";
import { useNavigate } from "react-router";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

function SecuritySettings() {
  const navigate = useNavigate();
  const logout = useAuth((state) => state.logout);

  const handleDeactivate = async () => {
  try {
    await axios.delete(`${backendUrl}/user-api/delete-user`,{ withCredentials: true });

    await logout();
    alert("Account deactivated");
    window.location.href = "/";

  } catch (err) {

    console.error(err);

    alert(
      err.response?.data?.message ||
      "Failed to deactivate account"
    );
  }
};

  const handleLogoutAll = async () => {
    try {
      await axios.post(`${backendUrl}/user-api/logout-all`, {}, { withCredentials: true });
      // clear client state
      await logout();
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to logout from all devices");
    }
  };

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-3xl p-6 compact:p-5 shadow-sm text-[#111827] transition-colors">

      <h2 className="text-2xl font-semibold mb-6 compact:mb-5">
        Security Settings
      </h2>

      <div className="space-y-4 compact:space-y-3">

        <button type="button" onClick={handleDeactivate}  className="bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600 transition">
          Deactivate Account
        </button>

        <button type="button" onClick={handleLogoutAll} className="bg-zinc-900 text-white px-5 py-2 rounded-xl hover:opacity-90 transition">
          Logout From All Devices
        </button>

      </div>
    </div>
  );
}

export default SecuritySettings;