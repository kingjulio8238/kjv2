import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import posthog from 'posthog-js'
import './index.css'
import App from './App.jsx'

posthog.init('phc_TaJbvRd7sxzt9hpMRM0nxhTDdNKFEvpSsh3Tzb88vjF', {
  api_host: 'https://us.i.posthog.com',
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
