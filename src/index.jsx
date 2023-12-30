import { createRoot } from 'react-dom/client'
import React from 'react'
import './index.css'
import App from './App'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import UserProvider from './context/userContext'
import { BrowserRouter } from 'react-router-dom'

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <UserProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
)
