import { Paper, Box, Button, Typography, Container } from "@mui/material"
import { useState, useEffect } from "react"
import { useUserContext } from "../../context/userContext"
import { updateData, fetchAPI } from "../../utils"
import { Link } from 'react-router-dom'
import Loader from '../Loader'
import { useNavigate } from "react-router-dom"

const AccountsList = () => {

    const navigate = useNavigate()

    const { accounts, currencies, setAccounts, setCurrencies } = useUserContext()

    const [loading, setLoading] = useState(false)

    const [totals, setTotals] = useState([])



    useEffect(() => {
        setLoading(true)
        updateData({setAccounts, setCurrencies})
            .then(() => {
                fetchAPI('post', '/api/accounts/totals')
                    .then(res => {
                        if (res.data) {
                            setTotals(res.data)
                        }
                    })
                    .catch(err => {
                        return err
                    })
                    .finally(() => {
                        setLoading(false)
                    })
            })

    }, [])

    return (

        <>
            {loading ? <Loader /> : <Container><Box sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                {!accounts.length ? <><Typography variant="h5">You don't have any accounts yet</Typography>
                    <Button
                        component={Link}
                        to="/wallet-items/create"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, mb: 2, width: '20rem' }}
                    >
                        Create your first account
                    </Button></> :

                    <>
                        <Box sx={{
                            display: 'flex',
                            '& > :not(style)': {
                                mx: "auto",
                            }
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexWrap: "wrap",
                                '& > :not(style)': {
                                    margin: '0 1rem 1rem 0'
                                }
                            }}>
                                {accounts.map(account =>
                                    <Paper onClick={()=> navigate(`/transactions?account=${account.name}`)} key={account._id} sx={{ width: '17rem', height: '14rem', cursor: 'pointer', display: 'flex', alignContent: "center", justifyContent: "center", flexDirection: "column", textAlign: "center" }}>
                                        <h2>{account.name}</h2>
                                        <h4>Balance: <span style={{ color: 'blue' }}>{currencies.find(currency => currency.acronym == account.currencyAcronym).symbol}{account.balance}</span></h4>
                                    </Paper>)}
                            </Box>
                            <Box x={{
                                display: 'flex',
                                '& > :not(style)': {
                                    margin: '0 1rem 1rem 0'
                                }
                            }}>
                                {totals.map(total =>
                                    <Paper key={total._id} sx={{ margin: '0 1rem 1rem 0', width: '15rem', height: '14rem', cursor: 'pointer', display: 'flex', alignContent: "center", justifyContent: "center", flexDirection: "column", textAlign: "center" }}>
                                        <h2>Total {total._id}</h2>
                                        <h4>Balance: <span style={{ color: 'blue' }}>{currencies.find(currency => currency.acronym == total._id).symbol}{total.count}</span></h4>
                                    </Paper>)}
                            </Box>
                        </Box>
                    </>
                }
            </Box>
            </Container>}
        </>
    )
}

export default AccountsList