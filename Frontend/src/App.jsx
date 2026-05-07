import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Home from './components/home'
import RootLayout from './components/RootLayout'
import Register from './components/Register'
import Login from './components/Login'
import ChatWindow from './components/ChatWindow'
import ChatList from './components/ChatList'
import Chat from './components/Chat'
RouterProvider


function App() {

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
        element: <ChatWindow/>,
        children:[
          {
              index: true,
              element: <ChatList />,
            },
            {
              index: true,
              element: <Chat />,
            }
        ]
      }
    ]
  }])

  return (
    <div>
      <RouterProvider router={routerObj} />
    </div>
  )
}

export default App