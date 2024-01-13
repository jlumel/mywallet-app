import LoggedOutMenu from "../../components/LoggedOutMenu"
import LoggedInMenu from "../../components/LoggedInMenu"
import { useUserContext } from "../../context/userContext"
import { useState } from "react"
import Loader from "../../components/Loader"
import { useEffect } from "react"
import { updateSession } from "../../utils"
import { CurrencySelection } from '../../components/Forms'

const Menu = () => {

    const { token, isLogged, setToken, setIsLogged, setUsername } = useUserContext()

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
            {loading ? <Loader /> : (isLogged ? <LoggedInMenu /> : <LoggedOutMenu />)}
        </>
    )
}

export default Menu