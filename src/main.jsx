import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>)

// Keep the app shell available when the device loses connectivity.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
