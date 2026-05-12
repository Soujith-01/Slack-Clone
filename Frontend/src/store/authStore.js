import axios from "axios";
import { create } from "zustand";
import { toast } from "react-hot-toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const useAuth = create((set) => ({
  currentUser: null,
  loading: false,
  isAuthenticated: false,
  error: null,
  activationRequired: false,
  activationEmail: null,

  setGoogleAuth: (user) => {
    set({
      currentUser: user,
      loading: false,
      isAuthenticated: true,
      error: null,
      activationRequired: false,
      activationEmail: null,
    });
  },

  login: async (userCred) => {
    try {
      set({ loading: true, error: null });
      console.log(userCred)
      const res = await axios.post(
        `${backendUrl}/user-api/login`,
        userCred,
        { withCredentials: true }
      );

      if (res.status === 200) {
        set({
          currentUser: res.data?.payload,
          loading: false,
          isAuthenticated: true,
          error: null,
          activationRequired: false,
          activationEmail: null,
        });
      }
    } catch (err) {
      console.log(err.response?.data);

      // Check if account activation is required
      if (err.response?.status === 403 && err.response?.data?.activateRequired) {
        set({
          loading: false,
          isAuthenticated: false,
          currentUser: null,
          error: err.response?.data?.message || "Account is deactivated",
          activationRequired: true,
          activationEmail: err.response?.data?.email,
        });
      } else {
        set({
          loading: false,
          isAuthenticated: false,
          currentUser: null,
          error:
            err.response?.data?.message ||
            err.response?.data?.error?.message ||
            err.message ||
            "Login failed",
          activationRequired: false,
          activationEmail: null,
        });
      }
    }
  },

  activateAccount: async (email, password) => {
    try {
      set({ loading: true, error: null });

      const res = await axios.post(`${backendUrl}/user-api/activate-account`, {
        email,
        password,
      });

      if (res.status === 200) {
        set({
          loading: false,
          error: null,
          activationRequired: false,
          activationEmail: null,
        });
        toast.success("Account activated successfully! Please login again.");
        return true;
      }
    } catch (err) {
      console.log(err.response?.data);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error?.message ||
        err.message ||
        "Activation failed";
      
      set({
        loading: false,
        error: errorMessage,
      });
      toast.error(errorMessage);
      return false;
    }
  },
  logout: async () => {
    try {
      set({
        loading: true,
        currentUser: null,
        isAuthenticated: false,
        error: null,
        activationRequired: false,
        activationEmail: null,
      });
      const res = await axios.get(`${backendUrl}/user-api/logout`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        set({ loading: false });
        toast.success("Logged out successfully");
        return true;
      }
    } catch (err) {
      console.log(err.response?.data);
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error:
          err.response?.data?.message ||
          err.response?.data?.error?.message ||
          err.message ||
          "Logout failed",
      });
      toast.error("Logout failed");
      return false;
    }
  },

  checkAuth: async () => {
    try {
      set({ loading: true });
      const res = await axios.get(`${backendUrl}/user-api/check-auth`, {
        withCredentials: true,
      });

      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err) {
      if (err.response?.status === 401) {
        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
          activationRequired: false,
          activationEmail: null,
        });
        return;
      }

      console.error("Auth check failed:", err);
      set({ loading: false });
    }
  },

  updateCurrentUser: (userData) =>
    set((state) => ({
      currentUser: {
        ...state.currentUser,
        ...userData,
      },
    })),
}));