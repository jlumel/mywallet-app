import LoggedOutMenu from "../../components/LoggedOutMenu"
import LoggedInMenu from "../../components/LoggedInMenu"
import { useUserContext } from "../../context/userContext"
import { useState } from "react"
import Loader from "../../components/Loader"
import { useEffect } from "react"
import { updateSession } from "../../utils"

const Menu = () => {

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
            {loading ? <Loader /> :(isLogged ? <LoggedInMenu /> : <LoggedOutMenu />)}
        </>
    )
}

export default Menu