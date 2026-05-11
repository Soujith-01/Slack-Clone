import React, { useEffect } from "react";
import {createBrowserRouter,RouterProvider} from "react-router";
import Home from "./components/home";
import RootLayout from "./components/RootLayout";
import Register from "./components/Register";
import Login from "./components/Login";
import ChatWindow from "./components/ChatWindow";
import UserProfile from "./components/userProfile";
import EditProfile from "./components/EditProfile";
import ChatList from "./components/ChatList";
import Chat from "./components/Chat";
import Settings from "./components/Settings";

import { useAuth } from "./store/authStore";

function App() {

  const checkAuth = useAuth(
    (state) => state.checkAuth
  );
  const currentUser = useAuth((state) => state.currentUser);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const darkMode = currentUser?.preferences?.darkMode ?? false;
    const compactMode = currentUser?.preferences?.compactMode ?? false;

    document.documentElement.classList.toggle("dark", darkMode);
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
    {
      path: "settings",
      element: <Settings />
    }
  ],
},
      {
        path: "UserProfile",
        element: <UserProfile/>
      },
      {
        path: "EditProfile",
        element: <EditProfile/>
      }
    ]
  }])
  

  return (
    <RouterProvider router={routerObj} />
  );
}

export default App;