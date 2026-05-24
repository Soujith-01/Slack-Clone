import React, { useEffect } from "react";
import {createBrowserRouter,RouterProvider} from "react-router";
import Home from "./components/layout/Home";
import RootLayout from "./components/layout/RootLayout";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import ChatWindow from "./components/chat/ChatWindow";
import UserProfile from "./components/profile/UserProfile";
import EditProfile from "./components/auth/EditProfile";
import ChatList from "./components/chat/ChatList";
import Chat from "./components/chat/Chat";
import Settings from "./components/profile/Settings";

import { useAuth } from "./store/authStore";
import { connectSocket } from "./socket";
function App() {

  const {
    isAuthenticated,
  } = useAuth();

  const checkAuth = useAuth(
    (state) => state.checkAuth
  );
  const currentUser = useAuth((state) => state.currentUser);

  useEffect(() => {
    checkAuth();
  }, []);

  // reconnect socket
  useEffect(() => {
    if (isAuthenticated) {
      connectSocket();
    }

  }, [isAuthenticated]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const compactMode = currentUser?.preferences?.compactMode ?? false;

    document.documentElement.classList.toggle("compact", compactMode);
  }, [currentUser]);

  const routerObj = createBrowserRouter([{
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "register",
        element: <Register/>
      },
      {
        path: "login",
        element: <Login/>
      },
      {
  path: "chat-window",
  element: <ChatWindow />,
  children: [
    {
      index: true,
      element: (
        <div className="h-full flex items-center justify-center text-gray-400">
          Select a chat
        </div>
      ),
    },
    {
      path: "Chat",
      element: <Chat />,
    },
  ],
},
      {
        path: "user-profile",
        element: <UserProfile/>
      },
      {
        path: "edit-profile",
        element: <EditProfile/>
      },
      {
      path: "settings",
      element: <Settings />
    }
    ]
  }])
  

  return (
    <RouterProvider router={routerObj} />
  );
}

export default App;