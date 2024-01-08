import { Container, Box } from "@mui/material"
import TransactionsList from "../../components/TransactionsList"
import PageTitle from "../../components/PageTitle/PageTitle"
import { useSearchParams } from "react-router-dom"

const Transactions = () => {

    const [searchParams, setSearchParams] = useSearchParams();

    const query = []
  
    searchParams.forEach((value, key) => {
        query.push({key, value})
      })

    return (
        <Container>

            <PageTitle text="Transactions"/>

            <Box sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
            }}>
                <TransactionsList query={query}/>
            </Box>

        </Container>
    )
}

export default Transactions