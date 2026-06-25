import React, { useEffect, useRef, useId } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { contactLinks } from '../data/constants'
import { Envelope, WhatsappLogo, InstagramLogo } from './Icons'

const Hu = [0.23, 1, 0.32, 1]

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.22, ease: Hu } },
  exit: { opacity: 0, scale: 0.98, y: -4, transition: { duration: 0.16, ease: Hu } }
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.06 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 }
}

const iconMap = {
  email: { comp: Envelope, weight: 'regular' },
  whatsapp: { comp: WhatsappLogo, weight: 'fill' },
  instagram: { comp: InstagramLogo, weight: 'fill' }
}

export default function ContactDialog({ open, onClose }) {
  const dialogId = useId()
  const dialogRef = useRef(null)
  const firstLinkRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      if (!dialog.open) {
        dialog.showModal()
      }
      // Focus the first button on open
      requestAnimationFrame(() => {
        firstLinkRef.current?.focus()
      })
    } else {
      if (dialog.open) {
        dialog.close()
      }
    }
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !open) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    dialog.addEventListener('keydown', handleKeyDown)
    return () => dialog.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={dialogId}
      className="fixed inset-0 z-50 m-auto w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl backdrop:bg-black/40 backdrop:backdrop-blur-[2px] open:flex open:flex-col theme-transition"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
    >
      {/* Click outside backdrop close helper */}
      <button
        type="button"
        tabIndex={-1}
        className="fixed inset-0 -z-10 bg-transparent cursor-default focus:outline-none"
        aria-label="Close dialog"
        onClick={onClose}
      />

      <AnimatePresence>
        {open && (
          <m.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dialogVariants}
            key="contact-panel"
            className="w-full flex flex-col"
          >
            <h2 id={dialogId} className="text-lg font-semibold tracking-tight text-foreground">
              Get in touch
            </h2>
            <p className="mt-1 text-[14px] text-muted">
              Choose how you'd like to reach me
            </p>

            <m.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="mt-6 flex items-center justify-center gap-4"
            >
              {contactLinks.map((link, idx) => {
                const iconData = iconMap[link.id] || { comp: Envelope, weight: 'regular' }
                const IconComponent = iconData.comp

                return (
                  <m.a
                    key={link.id}
                    ref={idx === 0 ? firstLinkRef : null}
                    href={link.href}
                    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    aria-label={link.label}
                    variants={itemVariants}
                    transition={{ duration: 0.2, ease: Hu }}
                    className="flex size-12 items-center justify-center rounded-full border border-border text-foreground transition-transform duration-[160ms] ease-out hover:bg-surface active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-card theme-transition"
                    onClick={onClose}
                  >
                    <IconComponent size={22} weight={iconData.weight} />
                  </m.a>
                )
              })}
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </dialog>
  )
}
