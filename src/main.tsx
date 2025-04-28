import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PageSettingsProvider } from './contexts/PageSettingsContext.tsx'
import { SimulationProvider } from './contexts/SimulationContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SimulationProvider>
      <PageSettingsProvider>
        <App />
      </PageSettingsProvider>
    </SimulationProvider>
  </StrictMode>,
)
