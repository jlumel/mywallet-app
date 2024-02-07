import { useEffect } from "react"
import { Form } from "../../components/Forms"
import PageTitle from '../../components/PageTitle'
import { useUserContext } from "../../context/userContext"
import { useNavigate } from "react-router-dom"

const Register = () => {

    document.title = 'My Wallet | Register'

    const { isLogged } = useUserContext()

    const navigate = useNavigate()

    useEffect(() => {

        isLogged && navigate('/')

    }, [isLogged])

    return (
        <>
            <PageTitle text="Register" />
            <Form type="Register" />
        </>
    )
}

export default Register