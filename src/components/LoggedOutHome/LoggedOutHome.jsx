import { fetchAPI } from "../../utils"
import { useUserContext } from "../../context/userContext"
import axios from "axios"

const LoggedOutHome = () => {

    const { setUsername, setIsLogged } = useUserContext()

    const logIn = (event) => {
        event.preventDefault()
        // axios.post('http://localhost:8080/user/login', {username: event.target['username'].value, password: event.target['password'].value})
        // .then(res => console.log(res.data))
        fetchAPI('post', '/user/login', { username: event.target['username'].value, password: event.target['password'].value })
            .then(data => {
                if (data.username) {
                    setIsLogged(true)
                    setUsername(data.username)
                }
            })
    }

    return (
        <form onSubmit={logIn}>
            <input type="text" name="username" />
            <input type="text" name="password" />
            <button>Log In</button>
        </form>
    )
}

export default LoggedOutHome