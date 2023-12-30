import { Routes, Route } from 'react-router-dom'
import Menu from './views/Menu'
import NavBar from './views/NavBar'
import { useUserContext } from './context/userContext'
import Register from './views/Register'
import Login from './views/Login/Login'
import { useEffect, useState } from 'react'
import { fetchAPI } from './utils'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import ChangePassword from './views/ChangePassword/ChangePassword'
import Loader from './components/Loader'
import Transactions from './views/Transactions'
import Accounts from './views/Accounts/Accounts'
import Admin from './views/Admin'

const theme = createTheme({
  direction: 'rtl',
});

function App() {

  const { setIsLogged, setUsername, token, setToken } = useUserContext()

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    if (localStorage.getItem('token')) {

      setToken(localStorage.getItem('token'))
    }

  }, [])

  useEffect(() => {

    if (token) {

      fetchAPI('post', '/api/user', null, token)
        .then(res => {

          if (res.isLogged) {

            if (res.token != token) {
              setToken(res.token)
              localStorage.setItem('token', res.token)
            }

            setIsLogged(true)
            setUsername(res.username)
          }
        })
        .catch(err => err)
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }

  }, [token])

  return (
    <>
      {loading ? (<Loader />) : (<ThemeProvider theme={theme}>
        <NavBar />
        <Routes>
          <Route path='/' element={<Menu />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/change-password' element={<ChangePassword />} />
          <Route path='/transactions' element={<Transactions />} />
          <Route path='/accounts' element={<Accounts />} />
          <Route path='/admin' element={<Admin />} />
        </Routes>
      </ThemeProvider>)}
    </>
  )
}

export default App
