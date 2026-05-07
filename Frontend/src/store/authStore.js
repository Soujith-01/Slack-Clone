import axios from "axios";
import { create } from "zustand";


export const useAuth = create((set) => ({
  currentUser: null,
  loading: false,
  isAuthenticated: false,
  error: null,
  login: async (userCred) => {
    // const { role, ...userCredObj } = userCredWithRole;
    try {
      //set loading true
      set(state=>({...state,loading: true}))
      //make api call
      let res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user-api/login`,userCred,{withCredentials:true})
      //update state
      if(res.status === 200){
        set({
            currentUser:res.data?.payload,
            loading: false,
            isAuthenticated: true,
            error: null
        })
      }
    } catch (err) {
      console.log(err.response?.data);
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        //error: err,
        error:
          err.response?.data?.message ||
          err.response?.data?.error?.message ||
          err.message ||
          "Login failed",
      });
    }
  },
  logout: async () => {
    try {
      //set loading state
      //make logout api req
      let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user-api/logout`, { withCredentials: true });
      //update state
      if (res.status === 200) {
        console.log(res.data)
        set({
          currentUser: null,
          isAuthenticated: false,
          error: null,
          loading: false,
        });
      }
    } catch (err) {
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
}
  },
  // restore login
  checkAuth: async () => {
    try {
      set({ loading: true });
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user-api/check-auth`, { withCredentials: true });

      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err) {
      // If user is not logged in → do nothing
      if (err.response?.status === 401) {
        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
        });
        return;
      }

      // other errors
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