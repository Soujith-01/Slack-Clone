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
} from "../styles/common";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import { GoogleLogin } from '@react-oauth/google'
import axios from "axios";
import { useAuth } from "../store/authStore";


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

    const res = await axios.post("http://localhost:3000/auth/google",{
        credential: credentialResponse.credential
      },
      {
        withCredentials: true
      }
    )

    if (res.data?.success) {
      useAuth.getState().setGoogleAuth({
        name: res.data.user?.name,
        email: res.data.user?.email,
        profileImageUrl: res.data.user?.picture,
      });
      navigate("/chat-window");
    }
  } catch (error) {
    console.log(error)
  }
}

  //When user registration submitted
  const onUserRegister = async (userObj) => {
    console.log(userObj);
    let {profileImageUrl}=userObj
    // file + userObj -->FormData
    //create ForMData object
    const formData = new FormData();
    //add all user properties and file to this formdata object
    formData.append("username", userObj.username);
    formData.append("email", userObj.email);
    formData.append("password", userObj.password);
    formData.append("gender", userObj.gender);
    //Append if image is exists
    if (profileImageUrl?.[0]) {
      formData.append("profileImageUrl", profileImageUrl[0]);
    }
    // console.log(profileImageUrl)
    try {
      //start loading
      setLoading(true);
      //make HTTP POST req to create User in backend
      let res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user-api/users`, formData,{withCredentials:true});

      if (res.status === 201) {
        //navigate to Login
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
    <div className={`${pageBackground} flex items-center justify-center py-4 px-4`}>
      <div className={formCard}>
        <h2 className={formTitle}>Create an Account</h2>

        {/* API Error */}
        {apiError && <p className={errorClass}>{apiError}</p>}

        <form onSubmit={handleSubmit(onUserRegister)}>
            <div className={divider} />
            {/* NAME */}
            <div className="sm:flex gap-4 mb-4">
                <div className="flex-1">
                    <label className={labelClass}>User Name</label>
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
                        validate: (v) => v.trim().length > 0 || "Cannot be empty",
                    })}
                    />
                    {errors.username && <p className={errorClass}>{errors.username.message}</p>}
                </div>
            </div>
            {/* EMAIL */}
            <div className={formGroup}>
                <label className={labelClass}>Email</label>
                <input
                type="email"
                className={inputClass}
                placeholder="you@example.com"
                {...register("email", {
                    required: "Email is required",
                })}
                />
                {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>
            {/* PASSWORD */}
            <div className={formGroup}>
                <label className={labelClass}>Password</label>
                <input
                type="password"
                className={inputClass}
                placeholder="Min. 8 characters"
                {...register("password", {
                required: "Password is required",
                })}
                />
                {errors.password && <p className={errorClass}>{errors.password.message}</p>}
            </div>
            {/* Gender */}
          <div className="mb-5">
            <p className={labelClass}>Gender</p>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="MALE"
                  {...register("gender", {
                    required: "Please select a role",
                  })}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className="text-sm">MALE</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="FEMALE"
                  {...register("gender", {
                    required: "Please select a gender",
                  })}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className="text-sm">FEMALE</span>
              </label>
            </div>

            {errors.gender && <p className={errorClass}>{errors.gender.message}</p>}
          </div>
            {/* PROFILE IMAGE */}
            <div className={formGroup}>
                <label className={labelClass}>Profile Image</label>
                <input
                type="file"
                className={inputClass}
                accept="image/png, image/jpeg"
                {...register("profileImageUrl", {
                    validate: {
                        fileType: (files) => {
                            if (!files?.[0]) return true;
                            return ["image/png", "image/jpeg"].includes(files[0].type) || "Only JPG/PNG allowed";
                        },
                        fileSize: (files) => {
                            if (!files?.[0]) return true;
                            return files[0].size <= 2 * 1024 * 1024 || "MAx size 2MB";
                        },
                    },
                })}
                onChange={(event) => {
                let file = event.target.files[0];
                if (file) {
                  setPriview(URL.createObjectURL(file));
                }}}
                />
                {errors.profileImageUrl && <p className={errorClass}>{errors.profileImageUrl.message}</p>}
                {/* image preview */}
                {preview && (
                    <div className="mt-3 flex justify-center">
                        <img src={preview} alt="" className="w-24 h-24 rounded-full object-cover" />
                    </div>
                )}
              </div>
            {/* SUBMIT */}
            <button type="submit" className={submitBtn}>
                Create Account
            </button>
            <p className="my-5 pl-35">OR</p>
            <div className="mt-4 flex justify-center">
              <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log("Google Login Failed")}/>
          </div>
        </form>


        {/* FOOTER */}
        <p className={`${mutedText} text-center mt-5`}>
          Already have an account?{" "}
          <NavLink to="/login" className="text-[#0066cc] dark:text-sky-400 font-medium">
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  )
}

export default Register;