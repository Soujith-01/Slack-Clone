import { useForm } from "react-hook-form";
import {
  pageBackground,
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  mutedText,
  linkClass,
  loadingClass,
} from "../../styles/common";
import { NavLink, useNavigate, useLocation } from "react-router";
import { useAuth } from "../../store/authStore";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { GoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { connectSocket } from "../../socket";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const navigate = useNavigate();
  
  // State for activation form
  const [activationPassword, setActivationPassword] = useState("");
  const [activationPasswordError, setActivationPasswordError] = useState("");

  // Memoize Google success handler to prevent unnecessary re-renders and multiple SDK initializations
  const handleGoogleSuccess = useCallback(async (credentialResponse) => {
    try {
      if (!credentialResponse?.credential) {
        toast.error("Invalid Google credential received");
        return;
      }

      // Send credential to backend
      const res = await axios.post("http://localhost:3000/auth/google", {
        credential: credentialResponse.credential
      }, {
        withCredentials: true
      });

      if (res.data?.success) {
        connectSocket();
        
        // Update auth state with user data from backend
        useAuth.getState().setGoogleAuth({
          _id: res.data.user?._id,
          name: res.data.user?.name,
          email: res.data.user?.email,
          profileImageUrl: res.data.user?.profileImageUrl,
        });
        
        toast.success("Google login successful!");
        navigate("/chat-window");
      } else {
        toast.error(res.data?.message || "Google login failed");
      }
    } catch (error) {
      console.error("Google login error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Google login failed";
      toast.error(errorMessage);
    }
  }, [navigate]);

  // Memoize Google error handler
  const handleGoogleError = useCallback(() => {
    toast.error("Google Sign-In failed. Please try again.");
    console.error("Google Login Error");
  }, []);

  // Get state from auth store
  const {
    login,
    activateAccount,
    currentUser,
    loading,
    error,
    isAuthenticated,
    activationRequired,
    activationEmail,
  } = useAuth((state) => state);

  // On user login
  const onUserLogin = async (userCredObj) => {
  await login(userCredObj);
};

  // Handle account activation
  const handleActivation = async () => {
    setActivationPasswordError("");

    if (!activationPassword.trim()) {
      setActivationPasswordError("Password is required");
      return;
    }

    const success = await activateAccount(activationEmail, activationPassword);
    if (success) {
      setActivationPassword("");
      reset();
    }
  };

  useEffect(() => {
    // Navigation logic
    if (isAuthenticated) {
      connectSocket();
      toast.success("Login successful");
      navigate("/chat-window");
    }
  }, [isAuthenticated, currentUser]);

  // Deal with loading
  if (loading) {
    return <p className={loadingClass}>Loading....</p>;
  }

  // Show activation form if account is deactivated
  if (activationRequired && activationEmail) {
    return (
      <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
        <div className={formCard}>
          {/* Title */}
          <h2 className={formTitle}>Reactivate Account</h2>

          {/* Message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              Your account is deactivated. Enter your password below to reactivate it.
            </p>
          </div>

          {/* Email display (read-only) */}
          <div className={formGroup}>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={activationEmail}
              disabled
              className={`${inputClass} opacity-70 cursor-not-allowed`}
            />
          </div>

          {/* Password */}
          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className={inputClass}
              value={activationPassword}
              onChange={(e) => {
                setActivationPassword(e.target.value);
                setActivationPasswordError("");
              }}
            />
            {activationPasswordError && (
              <p className={errorClass}>{activationPasswordError}</p>
            )}
          </div>

          {/* API error */}
          {error && !activationPasswordError && (
            <p className={errorClass}>{error}</p>
          )}

          {/* Activate button */}
          <button
            onClick={handleActivation}
            disabled={loading}
            className={`${submitBtn} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? "Reactivating..." : "Reactivate Account"}
          </button>

          {/* Back to login link */}
          <p className={`${mutedText} text-center mt-5`}>
            Remember your password?{" "}
            <button
              type="button"
              onClick={() => {
                setActivationPassword("");
                setActivationPasswordError("");
              }}
              className={linkClass}
            >
              Back to Login
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>
        {/* Title */}
        <h2 className={formTitle}>Sign In</h2>

        {/* API error */}
        {error && <p className={errorClass}>{error}</p>}

        <form onSubmit={handleSubmit(onUserLogin)}>
          {/* Email */}
          <div className={formGroup}>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className={inputClass}
              {...register("email", {
                required: "Email is required",
                validate: (value) =>
                  value.trim().length > 0 || "Email cannot be empty",
              })}
            />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className={inputClass}
              {...register("password", {
                required: "Password is required",
                validate: (value) =>
                  value.trim().length > 0 || "Password cannot be empty",
              })}
            />
            {errors.password && (
              <p className={errorClass}>{errors.password.message}</p>
            )}
          </div>

          {/* Forgot password */}
          <div className="text-right -mt-2 mb-4">
            <a href="/forgot-password" className={`${linkClass} text-xs`}>
              Forgot password?
            </a>
          </div>

          <div className="m-4 flex justify-center">
              <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}/>
          </div>

          {/* Submit */}
          <button type="submit" className={submitBtn}>
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className={`${mutedText} text-center mt-5`}>
          Don't have an account?{" "}
          <NavLink to="/register" className={linkClass}>
            Create one
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;