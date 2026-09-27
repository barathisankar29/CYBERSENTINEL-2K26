import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from '@/router'
import { ScrollManager } from '@/components/navigation/ScrollManager'
import { MascotProvider, Mascot, MascotRouteWatcher } from '@/components/mascot'

function App() {
  return (
    <BrowserRouter>
      <MascotProvider>
        <ScrollManager />
        <MascotRouteWatcher />
        <AppRoutes />
        <Mascot />
      </MascotProvider>
    </BrowserRouter>
  )
}

export default App
