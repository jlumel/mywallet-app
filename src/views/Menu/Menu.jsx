import LoggedOutMenu from "../../components/LoggedOutMenu"
import LoggedInMenu from "../../components/LoggedInMenu"
import { useUserContext } from "../../context/userContext"
import { useState } from "react"
import Loader from "../../components/Loader"
import { useEffect } from "react"

const Menu = () => {

    const { isLogged } = useUserContext()

    const [loading, setLoading] = useState(true)

    useEffect(() => {

        setLoading(false)

    }, [isLogged])

    return (
        <>
            {loading ? <Loader /> :(isLogged ? <LoggedInMenu /> : <LoggedOutMenu />)}
        </>
    )
}

export default Menu