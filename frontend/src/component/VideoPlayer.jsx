import React from 'react'

function VideoPlayer({media}) {
  return (
    <div className='h-[100%] relative cursor-pointer max-w-full rounded-2xl overflow-hidden'>
      <video src={media} loop controls className='h-[100%] cursor-pointer w-full object-cover rounded-2xl'></video>
    </div>
  )
}

export default VideoPlayer
