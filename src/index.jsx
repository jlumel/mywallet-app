import { createRoot } from 'react-dom/client'
import React from 'react'
import './assets/fonts/roboto/300.css'
import './assets/fonts/roboto/400.css'
import './assets/fonts/roboto/500.css'
import './assets/fonts/roboto/700.css'
import './index.css'
import App from './App'
import UserProvider from './context/userContext'
import { BrowserRouter } from 'react-router-dom'

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <UserProvider defaultToken={localStorage.getItem('token') || ""}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
)
