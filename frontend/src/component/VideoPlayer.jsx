import React, { useEffect, useRef } from 'react'

function VideoPlayer({ media }) {
  const videoRef = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      const video = videoRef.current
      if (!video) return

      if (entry.isIntersecting) {
        video
          .play()
          .catch(() => {
            // Autoplay block fix → force mute + retry
            video.muted = true
            video.play().catch(() => {})
          })
      } else {
        video.pause()
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

  return (
    <div className='h-[100%] relative cursor-pointer max-w-full rounded-2xl overflow-hidden'>
      <video
        src={media}
        ref={videoRef}
        loop
        muted
        playsInline
        controls
        className='h-[100%] cursor-pointer w-full object-cover rounded-2xl'
      ></video>
    </div>
  )
}

export default VideoPlayer
