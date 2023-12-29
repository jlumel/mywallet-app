import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './views/Home'
import NavBar from './views/NavBar'
import UserProvider from './context/userContext'
import { useUserContext } from './context/userContext'

function App() {

  return (
    <UserProvider>
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </UserProvider>
  )
}

export default App
