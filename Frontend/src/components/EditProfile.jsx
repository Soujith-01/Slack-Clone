import axios from "axios";
import { useForm } from "react-hook-form";
import { useAuth } from "../store/authStore";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

function EditProfile({ currentUser, setEditMode }) {

  const updateCurrentUser = useAuth(
    (state) => state.updateCurrentUser
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: currentUser?.username || "",
      email: currentUser?.email || "",
      password: "",
      gender: currentUser?.gender || "",
    },
  });

  // submit form
  const onUpdateProfile = async (updatedUser) => {

    try {

      const res = await axios.put(
        `${backendUrl}/user-api/users`,
        updatedUser,
        {
          withCredentials: true,
        }
      );

      // update zustand store
      updateCurrentUser(res.data.user);

      // close edit form
      setEditMode(false);

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "Update failed"
      );
    }
  };

  return (
    <div className="bg-white border border-[#e8e8ed] rounded-3xl p-6 mt-6 shadow-sm">

      <h2 className="text-xl font-semibold mb-6">
        Edit Profile
      </h2>

      <form onSubmit={handleSubmit(onUpdateProfile)}>

        {/* USERNAME */}
        <div className="mb-4">

          <label className="block text-sm mb-2">
            Username
          </label>

          <input
            type="text"
            placeholder="Username"
            className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-[#0066cc]"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 2,
                message: "Minimum 2 characters required",
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

          <label className="block text-sm mb-2">
            Email
          </label>

          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-[#0066cc]"
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

        {/* PASSWORD */}
        <div className="mb-4">

          <label className="block text-sm mb-2">
            New Password
          </label>

          <input
            type="password"
            placeholder="New Password"
            className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-[#0066cc]"
            {...register("password")}
          />
        </div>

        {/* GENDER */}
        <div className="mb-6">

          <label className="block text-sm mb-2">
            Gender
          </label>

          <select
            className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-[#0066cc]"
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
            className="px-5 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
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