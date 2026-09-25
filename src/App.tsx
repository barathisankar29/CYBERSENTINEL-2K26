import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from '@/router'
import { ScrollManager } from '@/components/navigation/ScrollManager'

function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
