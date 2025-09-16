import React, { use, useContext, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets';
import moment from 'moment'

const Sidebar = ({ setIsMenuOpen, isMenuOpen, }) => {

  const { chats, setSelectedChat, navigate, theme, setTheme, user } = useAppContext();
  const [search, setSearch] = useState('')


  return (
    <>

      <div className={`flex flex-col h-screen min-w-72 p-5 dark:bg-gradient-to-b from-[#242124] to-[#000000]/30 border-r border-[#80609F]/30 backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-1 ${!isMenuOpen && 'max-md:-translate-x-full'}`}>
        {/* logo */}
        <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} alt="" className='w-full max-w-48' />

        {/* button */}
        <button className='flex justify-center items-center w-full py-2 mt-10 text-white bg-gradient-to-r from-[#A456F7] to-[#3d81f6] text-sm rounded-md cursor-pointer'>
          <span className='mr-2 text-xl'>+</span> New Chat
        </button>


        {/* search conversation */}
        <div className="flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20 rounded-md">
          <img src={assets.search_icon} className='w-4 not-dark:invert' alt="" />
          <input onChange={(e) => setSearch(e.target.value)} value={search} type="text" placeholder='search coversation' className='text-xs placeholder:text-gray-400 outline-none' />
        </div>

        {/* Previous Chats */}
        {chats.length > 0 && <p className='mt-4 text-xm  dark:text-white'>Recent chats</p>}
        <div className=" flex-1 overflow-y-scroll mt-3 text-sm space-y-3  dark:text-white">
          {chats.filter((chat) => chat.messages[0] ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase()) : chat.name.toLowerCase().includes(search.toLowerCase())).map((chat) => (
            <div onClick={() => { navigate('/'); setSelectedChat(chat); setIsMenuOpen(false) }} className="p-2 px-4 dark:bg-[#57317c]/10 border border-gray-300 dark:boder-[#80609F]/15 rounded-md cursor-pointer flex justify-between group" key={chat._id}>
              <div className="">
                <p className='truncate w-fu;;'>{chat.messages.length > 0 ? chat.messages[0].content.slice(0, 32) : chat.name}</p>
                <p className='text-xs text-gray-500 darl;text-[#B1A6C0]'>{moment(chat.updatedAt).fromNow()}</p>
              </div>

              {/* delete and updated chtas icon */}
              <img src={assets.bin_icon} alt="" className='hidden group-hover:block w-4 cursor-pointer not-dark:invert' />
            </div>
          ))}
        </div>
        {/* Community Images */}
        <div onClick={() => { navigate('/community'); setIsMenuOpen(false) }} className="  dark:text-white flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all">
          <img src={assets.gallery_icon} className=' w-4.5 not-dark:invert' alt="" />
          <div className="flex flex-col text-sm">
            <p>communtiy Images</p>
          </div>
        </div>


        {/* Credits Purchase Options */}
        <div onClick={() => { navigate('/credits'); setIsMenuOpen(false) }} className=" dark:text-white flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all">
          <img src={assets.diamond_icon} className=' w-4.5 dark:invert' alt="" />
          <div className="flex flex-col text-sm">
            <p>Credits: {user?.credits}</p>
            <p className='text-xs text-gray-400'>Purchase credits to use quickChatgpt</p>
          </div>
        </div>


        {/* Dark Mode Toggle */}
        <div className="  dark:text-white flex items-center justify-between gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer ">
          <div className="flex items-center gap-2 text-sm">
            <img src={assets.theme_icon} className='w-4 not-dark:invert' alt="" />
            <p>Dark Mode</p>
          </div>
          <label className=' relative inline-flex cursor-pointer'>
            <input onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} type="checkbox" className='sr-only peer' checked={theme === "dark"} />
            <div className=" w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all"></div>
            <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4'></span>
          </label>
        </div>




        {/* User Account */}
        <div className="  dark:text-white flex items-center gap-3 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group">
          <img src={assets.user_icon} className=' w-7 rounded-full not-dark:invert' alt="" />
          <p className='flex-1 text-sm dark:text-primary truncate'>{user ? user.name : 'Login Your Account'}</p>
          {user && <img src={assets.logout_icon} alt="" className='hidden group-hover:block h-5  cursor-pointer not-dark:invert' />}
        </div>

        <img src={assets.close_icon} onClick={() => setIsMenuOpen(false)} alt="" className=' absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert ' />

      </div>
    </>
  )
}

export default Sidebar
