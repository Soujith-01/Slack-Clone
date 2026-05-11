import axios from "axios";
import { useForm } from "react-hook-form";
import { useAuth } from "../store/authStore";
import { useState } from "react";
import { useNavigate } from "react-router";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";


function EditProfile({ currentUser, setEditMode }) {

  const updateCurrentUser = useAuth(
    (state) => state.updateCurrentUser
  );

  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: currentUser?.username || "",
      email: currentUser?.email || "",
      oldPassword: "",
      newPassword: "",
      gender: currentUser?.gender || "",
    },
  });

  // submit form
  const onUpdateProfile = async (updatedUser) => {

    try {
      const navigate = useNavigate();
      setApiError("");

      const payload = {
        ...updatedUser,
        oldPassword: updatedUser.oldPassword?.trim() || "",
        newPassword: updatedUser.newPassword?.trim() || "",
      };

      const res = await axios.put(`${backendUrl}/user-api/users`,payload,{withCredentials: true,}
      );

      // update zustand store
      updateCurrentUser(res.data.user);

      // close edit form
      setEditMode(false);
      navigate("/user-profile");  

    } catch (err) {

      console.log(err);

      setApiError(
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "Update failed"
      );
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-[#e8e8ed] dark:border-zinc-800 rounded-3xl p-6 compact:p-5 mt-6 shadow-sm text-[#111827] dark:text-zinc-100 transition-colors">

      <h2 className="text-xl font-semibold mb-6 compact:mb-5">
        Edit Profile
      </h2>

      {/* API ERROR */}
      {apiError && (
        <p className="text-red-500 text-sm mb-4">
          {apiError}
        </p>
      )}

      <form onSubmit={handleSubmit(onUpdateProfile)}>

        {/* USERNAME */}
        <div className="mb-4">

          <label className="block text-sm mb-2 text-[#111827] dark:text-zinc-300">
            Username
          </label>

          <input
            type="text"
            placeholder="Username"
            className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-[#111827] dark:text-zinc-100 rounded-xl p-3 compact:p-2.5 outline-none focus:border-[#0066cc] dark:focus:border-sky-400"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 2,
                message: "Minimum 2 characters required",
              },
              maxLength: {
                value: 10,
                message: "Maximum 10 characters allowed",
              },
            })}
          />

          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* EMAIL */}
        <div className="mb-4">

          <label className="block text-sm mb-2 text-[#111827] dark:text-zinc-300">
            Email
          </label>

          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-[#111827] dark:text-zinc-100 rounded-xl p-3 compact:p-2.5 outline-none focus:border-[#0066cc] dark:focus:border-sky-400"
            {...register("email", {
              required: "Email is required",
            })}
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* OLD PASSWORD */}
        <div className="mb-4">

          <label className="block text-sm mb-2 text-[#111827] dark:text-zinc-300">
            Old Password
          </label>

          <input
            type="password"
            placeholder="Old Password"
            className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-[#111827] dark:text-zinc-100 rounded-xl p-3 compact:p-2.5 outline-none focus:border-[#0066cc] dark:focus:border-sky-400"
            {...register("oldPassword")}
          />
        </div>

        {/* NEW PASSWORD */}
        <div className="mb-4">

          <label className="block text-sm mb-2 text-[#111827] dark:text-zinc-300">
            New Password
          </label>

          <input
            type="password"
            placeholder="New Password"
            className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-[#111827] dark:text-zinc-100 rounded-xl p-3 compact:p-2.5 outline-none focus:border-[#0066cc] dark:focus:border-sky-400"
            {...register("newPassword", {
              minLength: {
                value: 6,
                message: "Minimum 6 characters required",
              },
            })}
          />

          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* GENDER */}
        <div className="mb-6">

          <label className="block text-sm mb-2 text-[#111827] dark:text-zinc-300">
            Gender
          </label>

          <select
            className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-[#111827] dark:text-zinc-100 rounded-xl p-3 compact:p-2.5 outline-none focus:border-[#0066cc] dark:focus:border-sky-400"
            {...register("gender")}
          >
            <option value="">Select Gender</option>
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
          </select>
        </div>

        {/* BUTTONS */}
        <div className="flex items-center justify-end gap-4">

          <button
            type="button"
            onClick={() => setEditMode(false)}
            className="px-5 py-2 rounded-full border border-gray-300 dark:border-zinc-700 text-[#111827] dark:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-[#0066cc] text-white px-5 py-2 rounded-full hover:bg-[#0052a3] transition"
          >
            Save Changes
          </button>

        </div>

      </form>
    </div>
  );
}

export default EditProfile;