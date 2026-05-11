import React from 'react'
import { Outlet } from 'react-router'
import SideBar from './SideBar'
import Header from './Header'


function RootLayout() {
  return (
  <div className='h-screen flex flex-col bg-white dark:bg-zinc-950 text-[#111827] dark:text-zinc-100 transition-colors'>
        < Header/>
        <div className ="flex-1 overflow-hidden">
            < Outlet/>
        </div>
    </div>
  )
}

export default RootLayout