import PageTitle from "../../components/PageTitle/PageTitle"
import { useEffect, useState } from "react"
import { updateSession } from '../../utils'
import Loader from '../../components/Loader'
import { useUserContext } from "../../context/userContext"
import { Container } from "@mui/material"
import { CreateModifyForm } from "../../components/Forms"
import { useParams } from 'react-router-dom'

const AdminFormContainer = () => {

    const {action} = useParams()

    const { setIsLogged, setUsername } = useUserContext()

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
            {loading ? <Loader /> :

                <Container>

                    <PageTitle text="Wallet Items" />

                    <CreateModifyForm action={action}/>

                </Container>}
        </>
    )
}

export default AdminFormContainer