import { Routes, Route } from 'react-router-dom'
import Menu from './views/Menu'
import NavBar from './components/NavBar'
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
import AdminFormContainer from './views/AdminFormContainer'
import TransactionDetail from './views/TransactionDetail/TransactionDetail'

const theme = createTheme()

function App() {

  const { token, setIsLogged, setUsername, setToken } = useUserContext()

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    setLoading(true)

    updateSession(setIsLogged, setUsername, token, setToken)
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
          <Route path='/change-password' element={<ChangePassword />} />
          <Route path='/transactions' element={<Transactions />} />
          <Route path='/accounts' element={<Accounts />} />
          <Route path='/wallet-items' element={<Admin />} />
          <Route path='/wallet-items/:action' element={<AdminFormContainer />} />
          <Route path='/transactions/:id' element={<TransactionDetail />} />
          <Route path='*' element={<Menu />} />
        </Routes>
      </ThemeProvider>)}
    </>
  )
}

export default App
