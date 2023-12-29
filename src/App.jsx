import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './views/Home'
import NavBar from './views/NavBar'
import UserProvider from './context/userContext'
import Register from './views/Register'
import Login from './views/Login/Login'
import { useEffect, useState } from 'react'
import { fetchAPI } from './utils'
import Loader from './components/Loader'
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  direction: 'rtl',
});

function App() {

  const [token, setToken] = useState(null)



  const [defaultSession, setDefaultSession] = useState(null)

  useEffect(() => {

    if (localStorage.getItem('token')) {

      setToken(localStorage.getItem('token'))
    }

  }, [])

  useEffect(() => {

    if (token) {

      fetchAPI('post', '/api/user', {}, token)
        .then(res => {
          if (res.username) {
            setDefaultSession(res)
          }
        })
    } else {
      setDefaultSession({isLogged: false, username:""})
    }

  }, [token])

  if (defaultSession === null) {

    return <Loader />
  }

  return (
    <ThemeProvider theme={theme}>
      <UserProvider defaultSession={defaultSession}>
        <NavBar />
        <Routes>
          <Route path='/' element={defaultSession ? <Home /> : <Loader />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </UserProvider>
    </ThemeProvider>
  )
}

export default App
