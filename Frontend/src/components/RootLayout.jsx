import React from 'react'
import { Outlet } from 'react-router'
import SideBar from './SideBar'
import Header from './Header'


function RootLayout() {
  return (
    <div>
        < Header/>
        <div className ="min-h-screen ">
            < Outlet/>
        </div>
    </div>
  )
}

export default RootLayout