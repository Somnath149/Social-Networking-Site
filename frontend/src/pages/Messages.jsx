import React from 'react'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

function Messages() {
  const navigate = useNavigate()
  return (
    <div className='w-full min-h-[100vh] flex flex-col bg-black gap-[20px] p-[10px]'>
      <div className='w-full h-[80px] flex fixed items-center gap-[20px] px-[20px]'>
        <MdOutlineKeyboardBackspace onClick={() => navigate(`/`)}
          className='text-white cursor-pointer lg:hidden w-[25px] h-[25px]' />
        <h1 className='text-white text-[20px] font-semibold'>Messages</h1>
      </div>
    </div>
  )
}

export default Messages
