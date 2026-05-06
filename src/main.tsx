import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')!
root.style.width = '100%'
root.style.maxWidth = '100%'
root.style.margin = '0'
root.style.border = 'none'

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)