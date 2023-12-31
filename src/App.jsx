import { Routes, Route } from 'react-router-dom'
import Menu from './views/Menu'
import NavBar from './views/NavBar'
import { useUserContext } from './context/userContext'
import Register from './views/Register'
import Login from './views/Login/Login'
import { useEffect, useState } from 'react'
import { updateSession } from './utils'
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

  const { isLogged, setIsLogged, setUsername } = useUserContext()

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    setLoading(true)

    updateSession(setIsLogged, setUsername)
      .finally(() => {
        setLoading(false)
      })

  }, [])

  return (
    <>
      {loading ? (<Loader />) : (<ThemeProvider theme={theme}>
        <NavBar />
        <Routes>
          <Route path='/' element={<Menu />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          {isLogged && <Route path='/change-password' element={<ChangePassword />} />}
          {isLogged && <Route path='/transactions' element={<Transactions />} />}
          {isLogged && <Route path='/accounts' element={<Accounts />} />}
          {isLogged && <Route path='/admin' element={<Admin />} />}
        </Routes>
      </ThemeProvider>)}
    </>
  )
}

export default App
