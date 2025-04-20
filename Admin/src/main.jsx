import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './Auth/authProvider.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import supabase from './Auth/supabaseClient.js'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { OwnerProvider } from './Context/OwnerContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
    <AuthProvider>
    <SessionContextProvider supabaseClient={supabase}>
    <OwnerProvider>
      <App />
    </OwnerProvider>
      </SessionContextProvider>
    </AuthProvider>
    </Router>
  </StrictMode>,
)
