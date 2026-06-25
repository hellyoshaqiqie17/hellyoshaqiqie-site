import React, { useState } from 'react'
import Meta from '../components/Meta'
import CoachingDialog from '../components/CoachingDialog'

export default function Coaching() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <Meta title="Coaching" path="/coaching" />
      <main className="flex min-h-[40vh] flex-col items-center justify-center py-20">
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="rounded-full bg-foreground px-8 py-4 text-[16px] font-medium text-canvas hover:bg-foreground/90 active:scale-[0.97] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-card theme-transition"
        >
          Book a Session
        </button>
      </main>

      <CoachingDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  )
}
