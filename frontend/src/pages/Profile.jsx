import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setProfileData, setUserData } from '../redux/userSlice'
import { MdOutlineKeyboardBackspace } from "react-icons/md"
import FollowersFollowingModal from '../component/FollowersFollowingModal'

import Nav from '../component/Nav'
import dp1 from "../assets/dp1.jpeg"
import FollowButton from '../component/FollowButton'
import Post from '../component/Post'
import { setSelectedUser } from '../redux/messageSlice'

function Profile() {
  const [PostType, setPostType] = useState("allPost")
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("followers")
  
  const navigate = useNavigate()
  const { userName } = useParams()
  const dispatch = useDispatch()
  const { profileData, userData } = useSelector(state => state.user)
  const { postData } = useSelector(state => state.post)

  const handleProfile = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/getProfile/${userName}`, { withCredentials: true })
      dispatch(setProfileData(result.data))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => { handleProfile() }, [userName, dispatch])

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
      dispatch(setUserData(null))
    } catch (error) { console.log(error) }
  }

  return (
    <div className='w-full h-screen overflow-y-auto bg-black'>
      {/* Top bar */}
      <div className='w-full h-[80px] flex justify-between items-center px-[30px] text-white'>
        <div className='cursor-pointer' onClick={() => navigate("/")}>
          <MdOutlineKeyboardBackspace className='text-white w-[25px] h-[25px]' />
        </div>
        <div className='font-semibold text-[20px]'>{profileData?.userName}</div>
        <div className='font-semibold cursor-pointer text-[20px]' onClick={handleLogOut}>Log out</div>
      </div>

      {/* Profile info */}
      <div className='w-full h-[150px] flex items-start gap-[20px] lg:gap-[50px] pt-[20px] px-[10px] justify-center'>
        <div className='w-[80px] h-[80px] md:w-[140px] md:h-[140px] border-2 border-black rounded-full overflow-hidden'>
          <img 
            src={profileData?.profileImage || dp1} 
            alt="" 
            className='w-full h-full object-cover' // ✅ Perfect circle
          />
        </div>
        <div>
          <div className='font-semibold text-[22px] text-white'>{profileData?.name}</div>
          <div className='text-[17px] text-[#ffffffe8]'>{profileData?.profession || "new User"}</div>
          <div className='text-[17px] text-[#ffffffe8]'>{profileData?.bio}</div>
        </div>
      </div>

      {/* Stats */}
      <div className='w-full h-[100px] flex items-center justify-center gap-[40px] md:gap-[60px] px-[20%] pt-[30px] text-white'>
        <div>
          <div className='text-white text-[22px] md:text-[30px] font-semibold'>{profileData?.posts.length}</div>
          <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>Posts</div>
        </div>

        <div onClick={() => { setModalType("following"); setShowModal(true) }} className='cursor-pointer'>
          <div className='text-white text-[22px] md:text-[30px] font-semibold'>{profileData?.following.length}</div>
          <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>Following</div>
        </div>

        <div onClick={() => { setModalType("followers"); setShowModal(true) }} className='cursor-pointer'>
          <div className='text-white text-[22px] md:text-[30px] font-semibold'>{profileData?.followers.length}</div>
          <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>Followers</div>
        </div>
      </div>

      {/* Follow / Message Buttons */}
      <div className='w-full h-[80px] flex justify-center items-center gap-[20px]'>
        {profileData?._id === userData._id ? 
          <button className='px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white cursor-pointer rounded-2xl' onClick={() => navigate("/editprofile")}>Edit Profile</button>
          :
          <>
            <FollowButton 
              tailwind='px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white cursor-pointer rounded-2xl'
              targetUserId={profileData?._id} 
              onFollowChange={handleProfile} 
            />
            <button 
              className='px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white cursor-pointer rounded-2xl'
              onClick={()=>{dispatch(setSelectedUser(profileData)); navigate("/messageArea")}}
            >
              Message
            </button>
          </>
        }
      </div>

      {/* Posts */}
      <div className='w-full min-h-[100vh] flex justify-center'>
        <div className='w-full max-w-[900px] flex flex-col items-center rounded-t-[30px] bg-white relative gap-[20px] pt-[30px] pb-[100px]'>
          {PostType === "allPost" && postData.map((post, index) => (
            post.author?._id === profileData?._id && <Post post={post} key={index} />
          ))}
        </div>
      </div>

      {/* Followers / Following Modal */}
      {showModal && <FollowersFollowingModal
        type={modalType}
        users={modalType === "followers" ? profileData?.followers : profileData?.following}
        onClose={() => setShowModal(false)}
      />}
    </div>
  )
}

export default Profile
