import React from 'react'
import { MdOutlineKeyboardBackspace } from "react-icons/md"
import { useNavigate } from 'react-router-dom'
import LoopCard from '../component/LoopCard'
import { useSelector } from 'react-redux'
function Loops() {
    const navigate = useNavigate()
        const { loopData } = useSelector(state => state.user)
    return (
        <div className='w-screen h-screen bg-black overflow-hidden flex justify-center items-center'>
            <div className='w-full h-[80px] flex fixed left-[20px] top-[20px] items-center gap-[20px] px-[20px]'>
                <MdOutlineKeyboardBackspace onClick={() => navigate(`/`)}
                    className='text-white cursor-pointer w-[25px] h-[25px]' />
                <h1 className='text-white text-[20px] font-semibold'>Loops</h1>
            </div>

            <div>
                {loopData?.map((loop,index) =>(
                    <LoopCard loop ={loop} key={index}/>
                ))}
            </div>
        </div>
    )
}

export default Loops
