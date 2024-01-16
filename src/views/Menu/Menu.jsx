import LoggedOutMenu from "../../components/LoggedOutMenu"
import LoggedInMenu from "../../components/LoggedInMenu"
import { useUserContext } from "../../context/userContext"
import { useState } from "react"
import Loader from "../../components/Loader"
import { useEffect } from "react"
import { updateData, updateSession } from "../../utils"
import { CurrencySelection } from '../../components/Forms'

const Menu = () => {

    document.title = 'My Wallet | Home'

    const { token, isLogged, accounts, setToken, setIsLogged, setUsername, setAccounts } = useUserContext()

    const [loading, setLoading] = useState(true)

    useEffect(() => {

        setLoading(true)

        updateSession(setIsLogged, setUsername, token, setToken)
            .finally(() => {
                updateData({ setAccounts }, token)
                    .finally(() => {
                        setLoading(false)
                    })
            })
    }, [])

    return (
        <>
            {loading ? <Loader /> : (isLogged ? accounts?.length ? <LoggedInMenu /> : <CurrencySelection /> : <LoggedOutMenu />)}
        </>
    )
}

export default Menu