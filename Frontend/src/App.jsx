import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Home from './components/home'
import RootLayout from './components/RootLayout'
import Register from './components/Register'
import Login from './components/Login'
import ChatWindow from './components/ChatWindow'
import UserProfile from './components/userProfile'
import { useAuth } from "./store/authStore";
import { useEffect } from 'react'
import EditProfile from './components/EditProfile'
RouterProvider


function App() {
   const checkAuth = useAuth((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);

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
        element: <ChatWindow/>
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
  }]
  )

  return (
    <div>
      <RouterProvider router={routerObj} />
    </div>
  )
}

export default App