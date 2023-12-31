import Form from "../../components/Form"
import { useUserContext } from "../../context/userContext"
import Loader from '../../components/Loader'
import { useState, useEffect } from "react"
import { updateSession } from "../../utils"

const ChangePassword = () => {

    const { setIsLogged, setUsername } = useUserContext()

    const [loading, setLoading] = useState()


    useEffect(() => {

        setLoading(true)

        updateSession(setIsLogged, setUsername)
            .finally(() => {
                setLoading(false)
            })

    }, [])

    return (
        <>
            {loading ? <Loader /> : <Form type="Change password" />}
        </>
    )
}

export default ChangePassword