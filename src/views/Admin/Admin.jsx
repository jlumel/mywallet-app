import PageTitle from "../../components/PageTitle/PageTitle"
import { useEffect, useState } from "react"
import { updateSession } from '../../utils'
import Loader from '../../components/Loader'
import { useUserContext } from "../../context/userContext"

const Admin = () => {

    const {setIsLogged, setUsername} = useUserContext()

    const [loading, setLoading] = useState(false)

    useEffect(() => {

        setLoading(true)

        updateSession(setIsLogged, setUsername)
            .finally(() => {
                setLoading(false)
            })

    }, [])

    return (
        <>
            {loading ? <Loader /> : <PageTitle text="Admin" />}
        </>
    )
}

export default Admin