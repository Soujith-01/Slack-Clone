import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router";
import { useState } from "react";

function UserProfile() {

  const logout = useAuth((state) => state.logout);

  const currentUser = useAuth(
    (state) => state.currentUser
  );

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // logout
  const onLogout = async () => {
    try {
      await logout();
    } finally {
      window.location.replace("/login");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 compact:py-8 text-[#111827] dark:text-zinc-100">

      {/* PROFILE CARD */}
      <div className="bg-white dark:bg-blue-900 border border-[#e8e8ed] dark:border-zinc-800 rounded-3xl p-6 compact:p-5 mb-8 shadow-sm flex items-center justify-between transition-colors">

        {/* LEFT */}
        <div className="flex items-center gap-4">

          {/* AVATAR */}
          {currentUser?.profileImageUrl ? (

            <img
              src={currentUser.profileImageUrl}
              className="w-16 h-16 rounded-full object-cover border border-[#e8e8ed] dark:border-zinc-700"
              alt="profile"
            />

          ) : (

            <div className="w-16 h-16 rounded-full bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center text-xl font-semibold">

              {currentUser?.username
                ?.charAt(0)
                .toUpperCase()}

            </div>
          )}

          {/* USER INFO */}
          <div>

            <p className="text-sm text-[#6e6e73] dark:text-zinc-400">
              Welcome back
            </p>

            <h2 className="text-xl font-semibold text-[#1d1d1f] dark:text-zinc-100">
              {currentUser?.username}
            </h2>

            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
              {currentUser?.email}
            </p>

          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex items-center gap-4">

          {/* SETTINGS */}
          <button
            onClick={() => navigate("/settings")}
            className="bg-[#0066cc] text-white px-5 py-2 rounded-full hover:bg-[#0052a3] transition"
          >
            Settings
          </button>

          {/* LOGOUT */}
          <button
            type="button"
            className="bg-[#ff3b30] text-white px-5 py-2 rounded-full hover:bg-[#d62c23] transition"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}

export default UserProfile;