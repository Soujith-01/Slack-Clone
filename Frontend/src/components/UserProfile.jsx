import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";

function UserProfile() {

  const logout = useAuth(
    (state) => state.logout
  );

  const currentUser = useAuth(
    (state) => state.currentUser
  );

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  // logout
  const onLogout = async () => {

    try {

      await logout();

    } finally {

      window.location.replace(
        "/login"
      );
    }
  };

  if (loading) {
    return (
      <p className="text-[#D6DCE5]">
        Loading...
      </p>
    );
  }

  return (
    <div className=" max-w-5xl mx-auto px-6 py-10 text-[#D6DCE5]">

      {/* PROFILE CARD */}
      <div className="bg-[#171A22] border border-[#2A2F3A] rounded-[28px] p-7 shadow-2xl flex items-center justify-between transition-all duration-300">

        {/* LEFT */}
        <div className="flex items-center gap-5">

          {/* AVATAR */}
          {currentUser?.profileImageUrl ? (

            <img
              src={
                currentUser.profileImageUrl
              }
              className="w-20 h-20 rounded-full object-cover border-2 border-[#2A2F3A] shadow-lg"
              alt="profile"
            />

          ) : (

            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#4F8CFF] to-[#3B6FD8] flex items-center justify-center text-2xl font-bold text-white shadow-xl">

              {currentUser?.username
                ?.charAt(0)
                .toUpperCase()}

            </div>
          )}

          {/* USER INFO */}
          <div>

            <p className="text-sm text-[#8B94A7] tracking-wide">
              Welcome back
            </p>

            <h2 className="text-2xl font-black tracking-tight text-[#E8ECF3] mt-1">
              {
                currentUser?.username
              }
            </h2>

            <p className="text-sm text-[#8B94A7] mt-2">
              {currentUser?.email}
            </p>

          </div>

        </div>

        {/* BUTTONS */}
        <div className="flex items-center gap-3">

          {/* SETTINGS */}
          <button
            onClick={() =>
              navigate("/settings")
            }
            className="px-5 py-2.5 rounded-2xl bg-[#0F1117] border border-[#2A2F3A] text-[#D6DCE5] font-semibold hover:bg-[#232734] transition-all duration-300"
          >
            Settings
          </button>

          {/* LOGOUT */}
          <button
            type="button"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#4F8CFF] to-[#3B6FD8] text-white font-semibold hover:opacity-90 transition-all duration-300 shadow-lg"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </div>
      {/* BACK BUTTON */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mt-6 text-[#8B94A7] hover:text-[#D6DCE5] transition-colors duration-200">
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </button>
    </div>
  );
}

export default UserProfile;