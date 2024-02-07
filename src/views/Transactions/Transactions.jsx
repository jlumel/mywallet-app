import { Container, Box } from "@mui/material"
import TransactionsList from "../../components/TransactionsList"
import PageTitle from "../../components/PageTitle/PageTitle"
import { useUserContext } from "../../context/userContext"
import { useNavigate } from "react-router"
import { useEffect } from "react"

const Transactions = () => {

    document.title = 'My Wallet | Transactions'

    const { isLogged } = useUserContext()

    const navigate = useNavigate()

    useEffect(() => {

        !isLogged && navigate('/')

    }, [])

    return (
        <Container>

            <PageTitle text="Transactions" />

            <Box sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
            }}>
                <TransactionsList />
            </Box>

        </Container>
    )
}

export default Transactions