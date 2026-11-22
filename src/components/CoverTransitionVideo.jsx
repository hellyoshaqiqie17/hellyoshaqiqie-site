import React, { useEffect, useRef, useState } from 'react'

// ---------------------------------------------------------------------------
// Global staggered download queue so multiple cards never fight for bandwidth
// on initial page load (Hero 1 -> Hero 2 -> Hero 3 -> viewport cards).
// ---------------------------------------------------------------------------
const SLOT_MAX_HOLD_MS = 2200
let activeLoadId = null
let activeSlotTimer = null
const pendingLoads = []

function pumpVideoQueue() {
  if (activeLoadId !== null || pendingLoads.length === 0) return
  pendingLoads.sort((a, b) => a.order - b.order)
  const next = pendingLoads.shift()
  if (!next) return
  activeLoadId = next.id
  clearTimeout(activeSlotTimer)
  activeSlotTimer = setTimeout(() => {
    releaseVideoSlot(next.id)
  }, SLOT_MAX_HOLD_MS)
  next.grant()
}

function enqueueVideoSlot(id, order, grant) {
  if (activeLoadId === id) {
    grant()
    return
  }
  if (pendingLoads.some((item) => item.id === id)) return
  pendingLoads.push({ id, order, grant })
  pumpVideoQueue()
}

function releaseVideoSlot(id) {
  const idx = pendingLoads.findIndex((item) => item.id === id)
  if (idx !== -1) pendingLoads.splice(idx, 1)
  if (activeLoadId === id) {
    activeLoadId = null
    clearTimeout(activeSlotTimer)
    activeSlotTimer = null
    pumpVideoQueue()
  }
}

let nextSlotCounter = 0

function isSaveDataEnabled() {
  try {
    return Boolean(typeof navigator !== 'undefined' && navigator.connection?.saveData)
  } catch {
    return false
  }
}

/**
 * Ensures the video has enough decoded buffer ahead to play smoothly without
 * immediately stalling on Frame 0. Never allows playback on readyState <= 2.
 */
function hasSafeBuffer(video) {
  if (!video || video.error) return false
  if (video.readyState >= 4) return true // HAVE_ENOUGH_DATA (canplaythrough)
  if (video.readyState < 3) return false // HAVE_CURRENT_DATA (only 1 frame) is NOT safe
  try {
    const dur = video.duration
    if (!Number.isFinite(dur) || dur <= 0) return false
    const ct = video.currentTime || 0
    const requiredAhead = Math.min(dur - 0.15, ct + 2.2)
    for (let i = 0; i < video.buffered.length; i++) {
      if (video.buffered.start(i) <= ct + 0.15 && video.buffered.end(i) >= requiredAhead) {
        return true
      }
    }
  } catch {
    return false
  }
  return false
}

/**
 * Displays a crisp UI mockup cover image for the first `coverDurationMs` (default 2000ms)
 * once visible in the viewport, then smoothly crossfades into the playing showcase video
 * ONLY after enough buffer is loaded and frames are actively advancing (zero blank/stuck flash).
 * When the video ends (or stalls on slow connections), smoothly crossfades back to the mockup cover.
 */
export default function CoverTransitionVideo({
  poster,
  videoSrc,
  webmSrc,
  alt,
  coverDurationMs = 2000,
  eager = false,
  loadOrder = 10,
  imagePosition = 'object-center',
  hoverScaleClass = 'group-hover:scale-[1.035]',
  className = 'w-full h-full',
}) {
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const imgRef = useRef(null)
  const resetTimerRef = useRef(null)
  const stallTimerRef = useRef(null)
  const slotIdRef = useRef(`vid-${++nextSlotCounter}`)
  const lastTimeRef = useRef(0)

  const [isInView, setIsInView] = useState(eager)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [hasPreloaded, setHasPreloaded] = useState(false)
  const [coverElapsed, setCoverElapsed] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [phase, setPhase] = useState('cover') // 'cover' | 'video'

  const saveData = isSaveDataEnabled()

  // Reset state if media source changes
  useEffect(() => {
    setPhase('cover')
    setCoverElapsed(false)
    setHasPreloaded(false)
    setVideoError(false)
    lastTimeRef.current = 0
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setImgLoaded(true)
    } else {
      setImgLoaded(false)
    }
  }, [videoSrc, webmSrc, poster])

  // Track viewport visibility so below-the-fold cards always get their full 2s cover reveal
  useEffect(() => {
    const el = containerRef.current
    const slotId = slotIdRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting
        setIsInView(visible)
        if (!visible) {
          clearTimeout(resetTimerRef.current)
          clearTimeout(stallTimerRef.current)
          releaseVideoSlot(slotId)
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
      clearTimeout(stallTimerRef.current)
      releaseVideoSlot(slotId)
    }
  }, [])

  // Enqueue video download sequentially once visible & cover image is ready (prevents bandwidth contention)
  useEffect(() => {
    if (saveData || videoError || !isInView || hasPreloaded) return

    const slotId = slotIdRef.current
    const initialYieldMs = eager ? (imgLoaded ? 220 : 550) : 200
    const timer = setTimeout(() => {
      enqueueVideoSlot(slotId, loadOrder, () => {
        setHasPreloaded(true)
      })
    }, initialYieldMs)

    return () => {
      clearTimeout(timer)
      if (!hasPreloaded) {
        releaseVideoSlot(slotId)
      }
    }
  }, [isInView, hasPreloaded, eager, imgLoaded, loadOrder, saveData, videoError])

  // Trigger preload once queue slot is granted; release slot as soon as buffered enough
  useEffect(() => {
    if (!hasPreloaded || saveData) return
    const video = videoRef.current
    if (!video) return

    const checkRelease = () => {
      if (hasSafeBuffer(video) || video.error) {
        releaseVideoSlot(slotIdRef.current)
      }
    }

    video.addEventListener('canplaythrough', checkRelease)
    video.addEventListener('progress', checkRelease)
    video.addEventListener('error', checkRelease)

    if (video.readyState === 0) {
      video.load()
    } else {
      checkRelease()
    }

    return () => {
      video.removeEventListener('canplaythrough', checkRelease)
      video.removeEventListener('progress', checkRelease)
      video.removeEventListener('error', checkRelease)
    }
  }, [hasPreloaded, videoSrc, webmSrc, saveData])

  // Run the 2-second mockup cover countdown once cover image is loaded and visible
  useEffect(() => {
    if (saveData || videoError || !isInView || !imgLoaded || phase !== 'cover') {
      setCoverElapsed(false)
      return
    }

    const timer = setTimeout(() => {
      setCoverElapsed(true)
    }, coverDurationMs)

    return () => clearTimeout(timer)
  }, [isInView, imgLoaded, phase, coverDurationMs, saveData, videoError])

  // 3-Gate playback reveal: wait for safe buffer -> start play silently -> reveal ONLY once frames advance!
  useEffect(() => {
    if (saveData || videoError || !isInView || phase !== 'cover' || !coverElapsed || !hasPreloaded) return

    const video = videoRef.current
    if (!video) return

    let cancelled = false
    let playStarted = false

    const revealOnceAdvancing = () => {
      if (cancelled) return
      if (!video.paused && !video.ended && video.currentTime >= 0.08) {
        cleanupListeners()
        lastTimeRef.current = video.currentTime
        setPhase('video')
      }
    }

    const tryStartPlayback = () => {
      if (cancelled || playStarted || !hasSafeBuffer(video)) return
      playStarted = true
      releaseVideoSlot(slotIdRef.current)

      try {
        if (video.currentTime > 0.2) video.currentTime = 0
      } catch {
        // ignore seek errors
      }

      const playPromise = video.play()
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise
          .then(() => {
            if (cancelled) return
            // Keep cover visible until frames genuinely advance past 0.08s
            video.addEventListener('timeupdate', revealOnceAdvancing)
            revealOnceAdvancing()
          })
          .catch(() => {
            // Autoplay blocked by browser policy: stay gracefully on crisp mockup cover
            playStarted = false
            if (!cancelled) setPhase('cover')
          })
      } else {
        video.addEventListener('timeupdate', revealOnceAdvancing)
        revealOnceAdvancing()
      }
    }

    const onBufferUpdate = () => {
      if (hasSafeBuffer(video)) {
        tryStartPlayback()
      }
    }

    const cleanupListeners = () => {
      video.removeEventListener('canplaythrough', onBufferUpdate)
      video.removeEventListener('progress', onBufferUpdate)
      video.removeEventListener('timeupdate', revealOnceAdvancing)
    }

    if (hasSafeBuffer(video)) {
      tryStartPlayback()
    } else {
      video.addEventListener('canplaythrough', onBufferUpdate)
      video.addEventListener('progress', onBufferUpdate)
      if (video.readyState === 0) {
        video.load()
      }
    }

    return () => {
      cancelled = true
      cleanupListeners()
    }
  }, [isInView, phase, coverElapsed, hasPreloaded, saveData, videoError])

  // Stall / buffering watchdog while playing: fade gracefully back to mockup cover instead of freezing blank
  const handleWaiting = () => {
    if (phase !== 'video') return
    clearTimeout(stallTimerRef.current)
    stallTimerRef.current = setTimeout(() => {
      const video = videoRef.current
      if (!video || video.paused || video.ended) return
      if (!hasSafeBuffer(video)) {
        video.pause()
        setPhase('cover')
        setCoverElapsed(false)
      }
    }, 700)
  }

  const handlePlayingOrProgress = () => {
    const video = videoRef.current
    if (!video) return
    if (video.currentTime > lastTimeRef.current + 0.02) {
      lastTimeRef.current = video.currentTime
      clearTimeout(stallTimerRef.current)
    }
  }

  const handleError = () => {
    clearTimeout(stallTimerRef.current)
    releaseVideoSlot(slotIdRef.current)
    setVideoError(true)
    setPhase('cover')
  }

  const handleEnded = () => {
    clearTimeout(stallTimerRef.current)
    setPhase('cover')
    setCoverElapsed(false)
    lastTimeRef.current = 0
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
        <div
          aria-hidden="true"
          className={`absolute inset-0 skeleton skeleton-shimmer transition-opacity duration-500 ${
            imgLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        />

        {!saveData && !videoError && (
          <video
            key={`${webmSrc || ''}|${videoSrc}`}
            ref={videoRef}
            poster={poster}
            muted
            playsInline
            preload={hasPreloaded ? 'auto' : 'none'}
            onEnded={handleEnded}
            onWaiting={handleWaiting}
            onStalled={handleWaiting}
            onPlaying={handlePlayingOrProgress}
            onTimeUpdate={handlePlayingOrProgress}
            onError={handleError}
            aria-label={alt}
            className={`absolute inset-0 w-full h-full object-cover object-center will-change-[opacity,transform] transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              phase === 'video' ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
            }`}
          >
            {webmSrc && <source src={webmSrc} type="video/webm" />}
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}

        <img
          ref={imgRef}
          src={poster}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : undefined}
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover ${imagePosition} will-change-[opacity,transform] transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            phase === 'video'
              ? 'opacity-0 scale-[1.035] pointer-events-none'
              : imgLoaded
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-[1.02]'
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
