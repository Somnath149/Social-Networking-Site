import React, { useEffect, useRef, useState } from 'react'
import { FiVolume2 } from 'react-icons/fi'
import { FiVolumeX } from 'react-icons/fi'
import dp from "../assets/dp.png"
import FollowButton from './FollowButton'
import { FaHeart, FaRegHeart, FaRegComment, FaRegBookmark, FaBookmark, FaRegPaperPlane } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { setLoopData } from '../redux/loopSlice'
import axios from 'axios'
import { div } from 'framer-motion/client'
function LoopCard({ loop }) {
  const videoRef = useRef()
  const commentRef = useRef()
  const dispatch = useDispatch()
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [message, setMessage] = useState("")
  const [showComment, setShowComment] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showHeart, setShowHeart] = useState(false)
  const { userData } = useSelector(state => state.user)
  const { loopData } = useSelector(state => state.loop)
  const HandleTimeUpdate = () => {
    const video = videoRef.current
    if (video) {
      const percent = (video.currentTime / video.duration) * 100
      setProgress(percent)
    }
  }

  const handleClick = () => {
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (commentRef.current && !commentRef.current.contains(event.target)) {
        setShowComment(false)
      }
    }

    if (showComment) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showComment])


  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      const video = videoRef.current
      if (entry.isIntersecting) {
        video.play()
        setIsPlaying(true)
      } else {
        video.pause()
        setIsPlaying(false)
      }
    }, { threshold: 0.6 })
    if (videoRef.current) {
      observer.observe(videoRef.current)
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current)
      }
    }
  }, [])

  const handleLike = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/loop/like/${loop._id}`, { withCredentials: true })
      const updatedLoop = result.data

      const updatedLoops = loopData.map(p =>
        p._id == loop._id ? updatedLoop : p
      )

      dispatch(setLoopData(updatedLoops))
    } catch (error) {
      console.error("Like failed:", error)
    }
  }


  const handleLikeOnDoubleClick = () => {
    setShowHeart(true)
    setTimeout(() =>
      setShowHeart(false)
      , 6000);
    { !loop.likes?.includes(userData._id) ? handleLike() : null }
  }

  const handleComment = async () => {
    try {
      const result = await axios.post(`${serverUrl}/api/loop/comment/${loop._id}`, { message }, { withCredentials: true })
      const updatedLoop = result.data

      const updatedLoops = loopData.map(p =>
        p._id == loop._id ? updatedLoop : p
      )

      dispatch(setLoopData(updatedLoops))

      setMessage("")
    } catch (error) {
      console.error("Comment failed:", error)
    }
  }

  return (
    <div className='w-full lg:w-[480px] h-[100vh] flex items-center justify-center border-l-2 border-r-2 border-gray-800 relative overflow-hidden'>

      {showHeart && <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 heart-animation z-50'>
        <FaHeart className="w-[100px] h-[100px] drop-shadow-2xl text-white" />
      </div>}

      <div ref={commentRef} className={`absolute z-[200] bottom-0 w-full h-[500px] shadow-2xl shadow-black
p-[10px] rounded-t-4xl bg-[#0e1718] transform transition-transform duration-500 ease-in-out left-0
  ${showComment ? "translate-y-0" : "translate-y-[100%] "}`}>

        <h1 className='text-white text-[20px] text-center font-semibold'>Comments</h1>

        <div className='w-full h-[350px] overflow-y-auto flex flex-col gap-[20px]'>
          {loop.comments.length == 0 &&
            <div className='text-center text-white text-[20px] font-semibold mt-[50px]'> No Comments Yet </div>}

          {loop.comments?.map((com, index) => (
            <div className='w-full flex flex-col gap-[5px] border-b-[1px] border-gray-800 justify-center pb-[10px] mt-[10px]'>
              <div className='flex justify-start items-center gap-[10px]'>
                <div className='w-[30px] h-[30px] md:w-[40px] md:h-[40px] border-2 border-gray-300 rounded-full cursor-pointer overflow-hidden'>
                  <img src={com.author?.profileImage || dp} alt="" className='w-full h-full object-cover' />
                </div>
                <div className='font-semibold text-white truncate max-w-[120px] md:max-w-[150px]'>
                  {com?.author?.userName}
                </div>
              </div>

              <div className='text-white pl-[60px]'>
                {com.message}
              </div>
            </div>
          ))}
        </div>

        <div className='w-full h-[80px] flex items-center justify-between px-[10px] fixed bottom-0'>
          <div className='w-[40px] h-[40px] md:w-14 md:h-14 border-2 border-gray-300 rounded-full cursor-pointer overflow-hidden'>
            <img src={loop.author?.profileImage || dp} alt="" className='w-full h-full object-cover' />
          </div>

          <input type="text" className='px-[10px] border-b-2 border-b-gray-500 text-white w-[90%] outline-none h-[40px]'
            onChange={(e) => setMessage(e.target.value)} value={message}
            placeholder='write comment...' /> {message &&
              <button onClick={handleComment}> <FaRegPaperPlane className="cursor-pointer text-white w-[20px] h-[20px]" /></button>
          }
        </div>
      </div>

      <video ref={videoRef} autoPlay muted={isMuted} loop src={loop?.media} className='w-full max-h-full'
        onClick={handleClick} onTimeUpdate={HandleTimeUpdate} onDoubleClick={handleLikeOnDoubleClick}></video>

      <div className='absolute top-[20px] z-[100] right-[20px]' onClick={() => setIsMuted(prev => !prev)}>
        {!isMuted ? <FiVolume2 className='w-[20px] h-[20px] text-white font-semibold' /> : <FiVolumeX className='w-[20px] h-[20px] text-white font-semibold' />}
      </div>

      <div className='absolute bottom-0 w-full h-[3px] bg-gray-900'>
        <div className='w-[200px] h-full bg-white transition-all duration-200 ease-linear' style={{ width: `${progress}%` }}>

        </div>
      </div>

      <div className='w-full absolute h-[100px] bottom-[10px] p-[10px] flex flex-col gap-[10px]'>
        <div className='flex items-center gap-4'>
          <div className='w-[20px] h-[20px] md:w-[40px] md:h-[40px] border-2 border-gray-300 rounded-full cursor-pointer overflow-hidden'>
            <img src={loop.author?.profileImage || dp} alt="" className='w-full h-full object-cover shrink-0' />
          </div>
          <div className='font-semibold truncate text-white max-w-[120px] md:max-w-[150px]'>
            {loop?.author?.userName}
          </div>

          <FollowButton targetUserId={loop.author?._id}
            tailwind={"px-[10px] py-[5px] text-white border-2 text-[14px] rounded-2xl border-white"} />
        </div>
        <div className='text-white p-[10px]'>
          {loop.caption}
        </div>

        <div className='absolute right-0 flex flex-col gap-[20px] text-white bottom-[150px] justify-center p-[10px]'>
          <div className='flex flex-col items-center cursor-pointer'>
            <div onClick={handleLike}>
              {!loop.likes.includes(userData._id) && <FaRegHeart className="w-[25px] cursor-pointer h-[25px]" />}
              {loop.likes.includes(userData._id) && <FaHeart className="w-[25px] cursor-pointer h-[25px] text-red-600" />}</div>
            <div>{loop.likes.length}</div>
          </div>

          <div className='flex flex-col items-center cursor-pointer'>
            <div onClick={() => setShowComment(true)}><FaRegComment className="w-[25px] cursor-pointer h-[25px]" />
            </div>
            <div>
              <span>{loop.comments.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoopCard
