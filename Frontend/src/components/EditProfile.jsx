import axios from "axios";
import { useForm } from "react-hook-form";
import { useAuth } from "../store/authStore";
import { useState } from "react";
import { useNavigate } from "react-router";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:3000";

function EditProfile({
  currentUser,
  setEditMode,
}) {
  const updateCurrentUser = useAuth(
    (state) =>
      state.updateCurrentUser
  );

  const [apiError, setApiError] =
    useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username:
        currentUser?.username || "",
      email:
        currentUser?.email || "",
      oldPassword: "",
      newPassword: "",
      gender:
        currentUser?.gender || "",
    },
  });

  // submit form
  const navigate = useNavigate();

  const onUpdateProfile = async (
    updatedUser
  ) => {
    try {
      setApiError("");

      const payload = {
        ...updatedUser,
        oldPassword:
          updatedUser.oldPassword?.trim() ||
          "",
        newPassword:
          updatedUser.newPassword?.trim() ||
          "",
      };

      const res = await axios.put(
        `${backendUrl}/user-api/users`,
        payload,
        {
          withCredentials: true,
        }
      );

      updateCurrentUser(res.data.user);

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
    <div className="bg-[#171A22] border border-[#2A2F3A] rounded-[28px] p-7 shadow-2xl text-[#E8ECF3] transition-all duration-300">

      {/* TITLE */}
      <div className="mb-7">

        <h2 className="text-2xl font-black tracking-tight">
          Edit Profile
        </h2>

        <p className="text-sm text-[#8B94A7] mt-2">
          Update your personal information
        </p>

      </div>

      {/* API ERROR */}
      {apiError && (
        <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-2xl text-sm">
          {apiError}
        </div>
      )}

      <form
        onSubmit={handleSubmit(
          onUpdateProfile
        )}
      >

        {/* USERNAME */}
        <div className="mb-5">

          <label className="block text-sm font-semibold mb-2 text-[#D6DCE5]">
            Username
          </label>

          <input
            type="text"
            placeholder="Username"
            className="w-full bg-[#0F1117] border border-[#2A2F3A] rounded-2xl px-4 py-3 outline-none focus:border-[#4F8CFF] text-[#E8ECF3] placeholder:text-[#6F7888] transition-all duration-300"
            {...register(
              "username",
              {
                required:
                  "Username is required",
                minLength: {
                  value: 2,
                  message:
                    "Minimum 2 characters required",
                },
                maxLength: {
                  value: 10,
                  message:
                    "Maximum 10 characters allowed",
                },
              }
            )}
          />

          {errors.username && (
            <p className="text-red-400 text-sm mt-2">
              {
                errors.username
                  .message
              }
            </p>
          )}

        </div>

        {/* EMAIL */}
        <div className="mb-5">

          <label className="block text-sm font-semibold mb-2 text-[#D6DCE5]">
            Email
          </label>

          <input
            type="email"
            placeholder="Email"
            className="w-full bg-[#0F1117] border border-[#2A2F3A] rounded-2xl px-4 py-3 outline-none focus:border-[#4F8CFF] text-[#E8ECF3] placeholder:text-[#6F7888] transition-all duration-300"
            {...register("email", {
              required:
                "Email is required",
            })}
          />

          {errors.email && (
            <p className="text-red-400 text-sm mt-2">
              {
                errors.email
                  .message
              }
            </p>
          )}

        </div>

        {/* OLD PASSWORD */}
        <div className="mb-5">

          <label className="block text-sm font-semibold mb-2 text-[#D6DCE5]">
            Old Password
          </label>

          <input
            type="password"
            placeholder="Old Password"
            className="w-full bg-[#0F1117] border border-[#2A2F3A] rounded-2xl px-4 py-3 outline-none focus:border-[#4F8CFF] text-[#E8ECF3] placeholder:text-[#6F7888] transition-all duration-300"
            {...register(
              "oldPassword"
            )}
          />

        </div>

        {/* NEW PASSWORD */}
        <div className="mb-5">

          <label className="block text-sm font-semibold mb-2 text-[#D6DCE5]">
            New Password
          </label>

          <input
            type="password"
            placeholder="New Password"
            className="w-full bg-[#0F1117] border border-[#2A2F3A] rounded-2xl px-4 py-3 outline-none focus:border-[#4F8CFF] text-[#E8ECF3] placeholder:text-[#6F7888] transition-all duration-300"
            {...register(
              "newPassword",
              {
                minLength: {
                  value: 6,
                  message:
                    "Minimum 6 characters required",
                },
              }
            )}
          />

          {errors.newPassword && (
            <p className="text-red-400 text-sm mt-2">
              {
                errors
                  .newPassword
                  .message
              }
            </p>
          )}

        </div>

        {/* GENDER */}
        <div className="mb-7">

          <label className="block text-sm font-semibold mb-2 text-[#D6DCE5]">
            Gender
          </label>

          <select
            className="w-full bg-[#0F1117] border border-[#2A2F3A] rounded-2xl px-4 py-3 outline-none focus:border-[#4F8CFF] text-[#E8ECF3] transition-all duration-300"
            {...register("gender")}
          >

            <option value="">
              Select Gender
            </option>

            <option value="MALE">
              MALE
            </option>

            <option value="FEMALE">
              FEMALE
            </option>

          </select>

        </div>

        {/* BUTTONS */}
        <div className="flex items-center justify-end gap-3">

          <button
            type="button"
            onClick={() =>
              setEditMode(false)
            }
            className="px-5 py-2.5 rounded-2xl border border-[#2A2F3A] bg-[#0F1117] hover:bg-[#232734] transition-all duration-300 text-[#D6DCE5] font-semibold"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#4F8CFF] to-[#3B6FD8] text-white hover:opacity-90 transition-all duration-300 font-semibold shadow-lg"
          >
            Save Changes
          </button>

        </div>

      </form>
    </div>
  );
}

export default EditProfile;