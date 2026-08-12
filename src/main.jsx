import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './cinematic.css'   // ← ultra-premium cinematic animation layer
import App from './App.jsx'
import { LanguageProvider } from './i18n/LanguageContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
