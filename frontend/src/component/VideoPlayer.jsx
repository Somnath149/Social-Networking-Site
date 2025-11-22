import React, { useEffect, useRef, useState } from 'react'

function VideoPlayer({ media }) {
  const videoRef = useRef()
  const [isMuted, setIsMuted] = useState(false) // default sound on

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

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  return (
    <div className='h-[100%] relative cursor-pointer max-w-full rounded-2xl overflow-hidden'>
      <video
        src={media}
        ref={videoRef}
        loop
        playsInline
        controls
        muted={isMuted} // control mute dynamically
        className='h-[100%] cursor-pointer w-full object-cover rounded-2xl'
      ></video>

      {/* Optional: click to toggle sound */}
      <button
        onClick={toggleMute}
        className='absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-lg'
      >
        {isMuted ? 'Unmute' : 'Mute'}
      </button>
    </div>
  )
}

export default VideoPlayer
