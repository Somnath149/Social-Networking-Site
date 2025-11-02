import React from 'react'
import dp from "../assets/dp.png"
import dp1 from "../assets/dp1.jpeg"
function StoryCard({profileImage, userName}) {
    return (
        <div className='flex flex-col w-[80px]'>
            <div className='w-[65px] h-[55px] bg-gradient-to-b from-blue-500 to-blue-950 rounded-full flex justify-center items-center'>
                <div className='w-[60px] h-[60px] border-1 border-black rounded-full cursor-pointer overflow-hidden'>
                    <img src={dp1} alt="" className='w-full object-cover' />
                </div>
            </div>
            <div className='text-[14px] text-center truncate w-full text-white'>{userName}</div>
        </div>
    )
}

export default StoryCard
