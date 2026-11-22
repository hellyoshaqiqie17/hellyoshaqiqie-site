import React, { useEffect, useRef, useState } from 'react'

/**
 * Displays a crisp UI mockup cover image for the first `coverDurationMs` (default 2000ms)
 * once visible in the viewport, then smoothly crossfades into the playing showcase video.
 * When the video ends, smoothly crossfades back to the mockup cover for 2s before replaying.
 */
export default function CoverTransitionVideo({
  poster,
  videoSrc,
  alt,
  coverDurationMs = 2000,
  eager = false,
  imagePosition = 'object-center',
  hoverScaleClass = 'group-hover:scale-[1.035]',
  className = 'w-full h-full',
}) {
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const resetTimerRef = useRef(null)

  const [isInView, setIsInView] = useState(eager)
  const [hasPreloaded, setHasPreloaded] = useState(eager)
  const [coverElapsed, setCoverElapsed] = useState(false)
  const [phase, setPhase] = useState('cover') // 'cover' | 'video'

  // Reset state if videoSrc changes
  useEffect(() => {
    setPhase('cover')
    setCoverElapsed(false)
  }, [videoSrc])

  // Track viewport visibility so below-the-fold cards always get their full 2s cover reveal
  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsInView(true)
      setHasPreloaded(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting
        setIsInView(visible)
        if (visible) {
          setHasPreloaded(true)
        } else {
          clearTimeout(resetTimerRef.current)
          setPhase('cover')
          setCoverElapsed(false)
          const video = videoRef.current
          if (video) {
            video.pause()
            try {
              video.currentTime = 0
            } catch {
              // ignore seek errors before metadata loads
            }
          }
        }
      },
      { threshold: 0.25 }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      clearTimeout(resetTimerRef.current)
    }
  }, [])

  // Trigger preload as soon as card enters viewport so video is ready right at t = 2s
  useEffect(() => {
    if (!hasPreloaded) return
    const video = videoRef.current
    if (video && video.readyState === 0) {
      video.load()
    }
  }, [hasPreloaded, videoSrc])

  // Run the 2-second mockup cover countdown whenever visible in 'cover' phase
  useEffect(() => {
    if (!isInView || phase !== 'cover') {
      setCoverElapsed(false)
      return
    }

    const timer = setTimeout(() => {
      setCoverElapsed(true)
    }, coverDurationMs)

    return () => clearTimeout(timer)
  }, [isInView, phase, coverDurationMs])

  // Once 2s cover hold has elapsed, start playback and reveal video only when actually playing
  useEffect(() => {
    if (!isInView || phase !== 'cover' || !coverElapsed) return

    const video = videoRef.current
    if (!video) return

    let cancelled = false

    const startPlayback = () => {
      if (cancelled) return
      try {
        video.currentTime = 0
      } catch {
        // ignore seek errors
      }
      const playPromise = video.play()
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise
          .then(() => {
            if (!cancelled) setPhase('video')
          })
          .catch(() => {
            // Autoplay blocked by browser policy: stay gracefully on mockup cover
            if (!cancelled) setPhase('cover')
          })
      } else if (!cancelled) {
        setPhase('video')
      }
    }

    if (video.readyState >= 2) {
      startPlayback()
      return () => {
        cancelled = true
      }
    }

    const onCanPlay = () => {
      video.removeEventListener('canplay', onCanPlay)
      startPlayback()
    }
    video.addEventListener('canplay', onCanPlay)
    if (video.readyState === 0) {
      video.load()
    }

    return () => {
      cancelled = true
      video.removeEventListener('canplay', onCanPlay)
    }
  }, [isInView, phase, coverElapsed])

  const handleEnded = () => {
    setPhase('cover')
    setCoverElapsed(false)
    clearTimeout(resetTimerRef.current)
    // Wait until cover image finishes fading back in before resetting video frame to 0
    resetTimerRef.current = setTimeout(() => {
      const video = videoRef.current
      if (video) {
        video.pause()
        try {
          video.currentTime = 0
        } catch {
          // ignore
        }
      }
    }, 750)
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div
        className={`w-full h-full relative transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${hoverScaleClass}`}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          preload={hasPreloaded ? 'auto' : 'none'}
          onEnded={handleEnded}
          aria-label={alt}
          className={`absolute inset-0 w-full h-full object-cover object-center will-change-[opacity,transform] transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            phase === 'video' ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
          }`}
        />

        <img
          src={poster}
          alt={alt}
          loading="eager"
          fetchPriority={eager ? 'high' : undefined}
          decoding="async"
          className={`absolute inset-0 w-full h-full object-cover ${imagePosition} will-change-[opacity,transform] transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            phase === 'video'
              ? 'opacity-0 scale-[1.035] pointer-events-none'
              : 'opacity-100 scale-100'
          }`}
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-black/[0.07] dark:ring-white/[0.08]"
      />
    </div>
  )
}
