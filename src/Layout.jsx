import React from 'react'
import { Outlet } from 'react-router-dom'
import Breadcrumb from './components/Breadcrumb'
import Navbar from './components/Navbar'

const Layout = () => {
  return (
    <div className='connect'>
        <Navbar />
        <Outlet/>
    </div>
  )
}

export default Layout