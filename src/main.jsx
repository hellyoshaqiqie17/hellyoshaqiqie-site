import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.jsx'

function mountApp() {
  window.__APP_MOUNTED__ = true

  const rootEl = document.getElementById('root')
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </React.StrictMode>
  )

  // Clean up inline boot skeleton styles once React has committed its first styled frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.remove('js-boot')
      document.getElementById('boot-critical-css')?.remove()
    })
  })
}

// Keep the inline shimmer boot skeleton on screen until the main stylesheet is active (zero FOUC)
const appSheet = document.getElementById('app-stylesheet')
if (!appSheet || appSheet.media === 'all' || window.__CSS_READY__) {
  mountApp()
} else {
  let mounted = false
  const finish = () => {
    if (mounted) return
    mounted = true
    if (appSheet.media !== 'all') appSheet.media = 'all'
    window.__CSS_READY__ = true
    // Yield one animation frame so the browser applies the stylesheet before React swaps #root
    requestAnimationFrame(mountApp)
  }
  appSheet.addEventListener('load', finish, { once: true })
  appSheet.addEventListener('error', finish, { once: true })
  setTimeout(finish, 3000)
}
