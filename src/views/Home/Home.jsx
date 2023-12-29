import LoggedOutHome from "../../components/LoggedOutHome"
import LoggedInHome from "../../components/LoggedInHome"
import { useUserContext } from "../../context/userContext"

const Home = () => {

    const {isLogged, username} = useUserContext()

    return (
        <>
            {isLogged ? <LoggedInHome username={username}/>: <LoggedOutHome />}
        </>
    )
}

export default Home