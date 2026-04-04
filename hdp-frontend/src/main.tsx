import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './calendar.css'
import App from './App.tsx'

// internalization setup
import './i18n'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
