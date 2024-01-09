import { Container, Box } from "@mui/material"
import TransactionsList from "../../components/TransactionsList"
import PageTitle from "../../components/PageTitle/PageTitle"

const Transactions = () => {

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