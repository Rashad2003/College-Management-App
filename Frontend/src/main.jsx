import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import StoreContextProvider from './context/StoreContext'

createRoot(document.getElementById('root')).render(
  <StoreContextProvider>
  <StrictMode>
    <App />
  </StrictMode>
  </StoreContextProvider>
)

