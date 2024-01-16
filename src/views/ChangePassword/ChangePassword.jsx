import { Form } from "../../components/Forms"
import { useUserContext } from "../../context/userContext"
import Loader from '../../components/Loader'
import { useState, useEffect } from "react"
import { updateSession } from "../../utils"
import PageTitle from '../../components/PageTitle'
import { useNavigate } from "react-router"

const ChangePassword = () => {

    const navigate = useNavigate()

    const { isLogged, token, setToken, setIsLogged, setUsername } = useUserContext()

    const [loading, setLoading] = useState()


    useEffect(() => {

        !isLogged && navigate('/')

        document.title = 'My Wallet | Change password'

        setLoading(true)

        updateSession(setIsLogged, setUsername, token, setToken)
            .finally(() => {
                setLoading(false)
            })

    }, [])

    return (
        <>
            {loading ? <Loader /> : <><PageTitle text={"Change password"} /><Form type="Change password" /></>}
        </>
    )
}

export default ChangePassword