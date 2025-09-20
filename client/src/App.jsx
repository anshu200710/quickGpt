import React, { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import ChatBox from './components/ChatBox'
import Credit from './pages/Credit'
import Community from './pages/Community'
import { assets } from './assets/assets'
import './assets/prism.css'
import Loading from './pages/Loading'
import { useAppContext } from './context/AppContext'
import Login from './pages/Login'
import { Toaster} from 'react-hot-toast'

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const {pathname } = useLocation()
  const {user, loadingUser} = useAppContext()


  if (pathname === '/loading'|| loadingUser) return <Loading/>

  return (
    <>
    <Toaster/>
      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert"
          onClick={() => setIsMenuOpen(true)}
        />
      )}

      {user ? (
        <div className="dark:bg-gradient-to-b from-[#242124] to-[#000000]">
        <div className="flex h-screen w-screen">
          <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          <Routes>
            <Route path="/" element={<ChatBox />} />
            <Route path="/credits" element={<Credit />} />
            <Route path="/community" element={<Community />} />
          </Routes>
        </div>
      </div>
      ) : (
        <div className="bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen">
          <Login/>
        </div>
      )}
      
    </>
  )
}

export default App
