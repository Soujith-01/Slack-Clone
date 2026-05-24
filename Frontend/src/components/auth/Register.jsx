import {
  divider,
  errorClass,
  formCard,
  formGroup,
  formTitle,
  inputClass,
  labelClass,
  pageBackground,
  submitBtn,
  mutedText,
} from "../../styles/common";

import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "../../store/authStore";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [preview, setPriview] = useState(null);

  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/auth/google",
        {
          credential: credentialResponse.credential,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data?.success) {
        useAuth.getState().setGoogleAuth({
          name: res.data.user?.name,
          email: res.data.user?.email,
          profileImageUrl: res.data.user?.picture,
        });

        navigate("/chat-window");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Register User
  const onUserRegister = async (userObj) => {
    let { profileImageUrl } = userObj;

    const formData = new FormData();

    formData.append("username", userObj.username);
    formData.append("email", userObj.email);
    formData.append("password", userObj.password);
    formData.append("gender", userObj.gender);

    if (profileImageUrl?.[0]) {
      formData.append("profileImageUrl", profileImageUrl[0]);
    }

    try {
      setLoading(true);

      let res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user-api/users`,
        formData,
        { withCredentials: true }
      );

      if (res.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      console.log("err in registration", err);

      setApiError(
        err.response?.data?.message ||
          err.response?.data?.error?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${pageBackground} flex items-center justify-center min-h-screen px-4 py-10`}
    >
      <div className="w-full max-w-6xl grid lg:grid-cols-2 rounded-[32px] overflow-hidden border border-[#1a1a1a] shadow-[0_0_50px_rgba(17,168,232,0.08)]">

        {/* LEFT SECTION */}
        <div className="hidden lg:flex flex-col justify-center bg-[#050505] px-16 py-20 relative overflow-hidden">

          {/* Glow */}
          <div className="absolute w-96 h-96 bg-[#11A8E8]/10 rounded-full blur-3xl -top-24 -left-24"></div>

          {/* Lines */}
          <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#11A8E8_1px,transparent_1px),linear-gradient(to_bottom,#11A8E8_1px,transparent_1px)] bg-[size:80px_80px]"></div>

          <div className="relative z-10">

            <p className="text-[#11A8E8] uppercase tracking-[0.35em] text-sm font-black mb-6">
              Welcome
            </p>

            <h1 className="text-6xl font-black leading-none text-white uppercase tracking-tight">
              Join The
              <br />
              Community.
            </h1>

            <p className="mt-8 text-[#8a8a8a] text-lg leading-relaxed max-w-md">
              Create your account and start chatting with your team in real-time.
              Collaborate faster, share ideas, and stay connected from anywhere.
            </p>

            <div className="mt-10 border border-[#1f1f1f] bg-[#0d0d0d] rounded-3xl p-6 backdrop-blur-xl">
              <p className="text-[#b3b3b3] text-sm leading-relaxed">
                Secure messaging, channels, reactions, threads, file sharing and
                everything your team needs — all in one platform.
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="bg-[#090909] flex items-center justify-center p-6 sm:p-10">

          <div className={`${formCard} w-full max-w-md bg-transparent border-none shadow-none`}>

            <h2 className={`${formTitle} text-left`}>
              Create an Account
            </h2>

            {/* ERROR */}
            {apiError && <p className={errorClass}>{apiError}</p>}

            <form onSubmit={handleSubmit(onUserRegister)}>

              <div className={divider} />

              {/* USERNAME */}
              <div className="sm:flex gap-4 mb-4">
                <div className="flex-1">

                  <label className={labelClass}>
                    User Name
                  </label>

                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Name"
                    {...register("username", {
                      required: "User name is required",
                      minLength: {
                        value: 2,
                        message: "At least 2 characters required",
                      },
                      maxLength: {
                        value: 30,
                        message: "Max 30 characters allowed",
                      },
                      validate: (v) =>
                        v.trim().length > 0 || "Cannot be empty",
                    })}
                  />

                  {errors.username && (
                    <p className={errorClass}>
                      {errors.username.message}
                    </p>
                  )}

                </div>
              </div>

              {/* EMAIL */}
              <div className={formGroup}>

                <label className={labelClass}>
                  Email
                </label>

                <input
                  type="email"
                  className={inputClass}
                  placeholder="you@example.com"
                  {...register("email", {
                    required: "Email is required",
                  })}
                />

                {errors.email && (
                  <p className={errorClass}>
                    {errors.email.message}
                  </p>
                )}

              </div>

              {/* PASSWORD */}
              <div className={formGroup}>

                <label className={labelClass}>
                  Password
                </label>

                <input
                  type="password"
                  className={inputClass}
                  placeholder="Min. 8 characters"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />

                {errors.password && (
                  <p className={errorClass}>
                    {errors.password.message}
                  </p>
                )}

              </div>

              {/* GENDER */}
              <div className="mb-5">

                <p className={labelClass}>
                  Gender
                </p>

                <div className="flex gap-8 mt-2">

                  <label className="flex items-center gap-2 cursor-pointer text-[#d4d4d4]">

                    <input
                      type="radio"
                      value="MALE"
                      {...register("gender", {
                        required: "Please select a role",
                      })}
                      className="accent-[#11A8E8] w-4 h-4"
                    />

                    <span className="text-sm font-medium">
                      MALE
                    </span>

                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-[#d4d4d4]">

                    <input
                      type="radio"
                      value="FEMALE"
                      {...register("gender", {
                        required: "Please select a gender",
                      })}
                      className="accent-[#11A8E8] w-4 h-4"
                    />

                    <span className="text-sm font-medium">
                      FEMALE
                    </span>

                  </label>

                </div>

                {errors.gender && (
                  <p className={errorClass}>
                    {errors.gender.message}
                  </p>
                )}

              </div>

              {/* PROFILE IMAGE */}
              <div className={formGroup}>

                <label className={labelClass}>
                  Profile Image
                </label>

                <input
                  type="file"
                  className={inputClass}
                  accept="image/png, image/jpeg"
                  {...register("profileImageUrl", {
                    validate: {
                      fileType: (files) => {
                        if (!files?.[0]) return true;

                        return (
                          ["image/png", "image/jpeg"].includes(
                            files[0].type
                          ) || "Only JPG/PNG allowed"
                        );
                      },

                      fileSize: (files) => {
                        if (!files?.[0]) return true;

                        return (
                          files[0].size <= 2 * 1024 * 1024 ||
                          "MAx size 2MB"
                        );
                      },
                    },
                  })}
                  onChange={(event) => {
                    let file = event.target.files[0];

                    if (file) {
                      setPriview(URL.createObjectURL(file));
                    }
                  }}
                />

                {errors.profileImageUrl && (
                  <p className={errorClass}>
                    {errors.profileImageUrl.message}
                  </p>
                )}

                {/* PREVIEW */}
                {preview && (
                  <div className="mt-5 flex justify-center">
                    <img
                      src={preview}
                      alt=""
                      className="w-24 h-24 rounded-full object-cover border-2 border-[#11A8E8] shadow-[0_0_25px_rgba(17,168,232,0.25)]"
                    />
                  </div>
                )}

              </div>

              {/* SUBMIT */}
              <button type="submit" className={submitBtn}>
                {loading ? "Creating..." : "Create Account"}
              </button>

              {/* OR */}
              <p className="my-6 text-center text-[#666666] font-medium">
                OR
              </p>

              {/* GOOGLE LOGIN */}
              <div className="mt-4 flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => console.log("Google Login Failed")}
                />
              </div>

            </form>

            {/* FOOTER */}
            <p className={`${mutedText} text-center mt-6`}>
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="text-[#11A8E8] hover:text-[#38BDF8] font-semibold transition-colors"
              >
                Sign in
              </NavLink>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;