import { useEffect } from "react"
import { Form } from "../../components/Forms"
import PageTitle from "../../components/PageTitle"
import { useUserContext } from "../../context/userContext"
import { useNavigate } from "react-router-dom"


const Login = () => {

    document.title = 'My Wallet | Log In'

    const { isLogged } = useUserContext()

    const navigate = useNavigate()

    useEffect(()=> {
    
       isLogged && navigate('/')

    }, [isLogged])

    return (
        <>
            <PageTitle text={"Log In"} />
            <Form type="Log In" />
        </>

    )
}

export default Login