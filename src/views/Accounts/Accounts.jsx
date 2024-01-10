import PageTitle from "../../components/PageTitle/PageTitle"
import { useEffect, useState } from "react"
import { updateSession } from '../../utils'
import Loader from '../../components/Loader'
import { useUserContext } from "../../context/userContext"
import AccountsList from "../../components/AccountsList/AccountsList"
import { useNavigate } from "react-router"

const Accounts = () => {

    const { isLogged, token, setToken, setIsLogged, setUsername } = useUserContext()

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {

        !isLogged && navigate('/')

        setLoading(true)

        updateSession(setIsLogged, setUsername, token, setToken)
            .finally(() => {
                setLoading(false)
            })

    }, [])

    return (
        <>
            {loading ? <Loader /> :
                < >
                    <PageTitle text="Accounts" />
                    <AccountsList setLoading={setLoading} />
                </>
            }
        </>
    )
}

export default Accounts