import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from '@/router'
import { ScrollManager } from '@/components/navigation/ScrollManager'
// The site mascot is not shown on any page; the provider stays because the
// buildings and events terminal still report interactions to it (no-ops now).
import { MascotProvider } from '@/components/mascot'
import { BackgroundMusicHUD } from '@/components/audio/BackgroundMusicHUD'

function App() {
  return (
    <BrowserRouter>
      <MascotProvider>
        <ScrollManager />
        <BackgroundMusicHUD />
        <AppRoutes />
      </MascotProvider>
    </BrowserRouter>
  )
}

export default App
