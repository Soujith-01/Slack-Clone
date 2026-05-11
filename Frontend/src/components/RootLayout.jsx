import React from 'react'
import { Outlet } from 'react-router'
import Header from './Header'

function RootLayout() {
  return (
<<<<<<< HEAD
    <div className='h-screen flex flex-col '>
        < Header/>
        <div className ="flex-1 overflow-y-auto">
            < Outlet/>
        </div>
=======
    <div className="h-screen flex flex-col">
      
      {/* Header */}
      <Header />

      {/* Page Content */}
      <div className="flex-1 min-h-0">
        <Outlet />
      </div>

>>>>>>> 0570986134ce665f88a7fa8681adc6235029a876
    </div>
  )
}

export default RootLayout