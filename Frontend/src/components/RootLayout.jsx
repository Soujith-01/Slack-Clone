import React from 'react'
import { Outlet } from 'react-router'
import Header from './Header'

function RootLayout() {
  return (
    <div className="h-screen flex flex-col">
      
      {/* Header */}
      <Header />

      {/* Page Content */}
      <div className="flex-1 min-h-0">
        <Outlet />
      </div>

    </div>
  )
}

export default RootLayout