import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/globals.css'
import { initDevicePerf } from '@/utils/devicePerf'
import App from './App.tsx'
import { UnderDevelopmentGate } from '@/components/gate/UnderDevelopmentGate'
import { SITE_UNDER_DEVELOPMENT } from '@/config/siteGate'

initDevicePerf()

createRoot(document.getElementById('root')!).render(
  // The gate applies to builds only; the local dev server (npm run dev) always shows the full site.
  <StrictMode>{SITE_UNDER_DEVELOPMENT && !import.meta.env.DEV ? <UnderDevelopmentGate /> : <App />}</StrictMode>,
)

