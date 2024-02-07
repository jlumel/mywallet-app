import PageTitle from "../../components/PageTitle/PageTitle"
import { useEffect, useState } from "react"
import { updateSession } from '../../utils'
import Loader from '../../components/Loader'
import { useUserContext } from "../../context/userContext"
import { CreateModifyForm } from "../../components/Forms"
import { useParams } from 'react-router-dom'
import { useNavigate } from "react-router-dom"

const AdminFormContainer = () => {

    document.title = action == 'create' ? 'My Wallet | Create' : 'My Wallet | Modify'

    const navigate = useNavigate()

    const { action } = useParams()

    const { isLogged, token, setToken, setIsLogged, setUsername } = useUserContext()

    const [loading, setLoading] = useState(false)

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
                <>
                    <PageTitle text="Wallet Items" />
                    <CreateModifyForm action={action} />
                </>}
        </>
    )
}

export default AdminFormContainer