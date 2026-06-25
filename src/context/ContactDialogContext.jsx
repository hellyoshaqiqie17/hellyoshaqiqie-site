import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import ContactDialog from '../components/ContactDialog'

const ContactDialogContext = createContext(null)

export function ContactDialogProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  const openContactDialog = useCallback(() => setIsOpen(true), [])
  const closeContactDialog = useCallback(() => setIsOpen(false), [])

  const value = useMemo(() => ({
    openContactDialog,
    closeContactDialog
  }), [openContactDialog, closeContactDialog])

  return (
    <ContactDialogContext.Provider value={value}>
      {children}
      <ContactDialog open={isOpen} onClose={closeContactDialog} />
    </ContactDialogContext.Provider>
  )
}

export function useContactDialog() {
  const context = useContext(ContactDialogContext)
  if (!context) {
    throw new Error('useContactDialog must be used within a ContactDialogProvider')
  }
  return context
}
