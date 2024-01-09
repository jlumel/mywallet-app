import { Paper, Box, Button, Typography, Container } from "@mui/material"
import { useState, useEffect } from "react"
import { useUserContext } from "../../context/userContext"
import { updateData, fetchAPI } from "../../utils"
import { Link } from 'react-router-dom'
import Loader from '../Loader'
import { useNavigate } from "react-router-dom"

const AccountsList = () => {

    const navigate = useNavigate()

    const { accounts, currencies, setAccounts, setCurrencies, setQuery } = useUserContext()

    const [loading, setLoading] = useState(false)

    const [totals, setTotals] = useState([])

    const handleClick = query => {
        setQuery([query])
        navigate('/transactions')
    }

    useEffect(() => {
        setLoading(true)
        updateData({ setAccounts, setCurrencies })
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
                alignItems: 'center',
                justifyContent: "center"
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
                            flexDirection: "column",
                            justifyContent: 'center',
                            alignItems: 'center',
                            '& > :not(style)': {
                                mx: "auto",
                            }
                        }}>
                            <Box sx={{
                                margin: "auto",
                                display: 'flex',
                                flexWrap: "wrap",
                                justifyContent: "left",
                                alignItems: 'left',
                                '& > :not(style)': {
                                    margin: '0 1rem 1rem 0'
                                }
                            }}>
                                {accounts.map(account =>
                                    <Paper onClick={()=> handleClick({key: 'accountName', value: account.name})} key={account._id} sx={{ width: '12rem', height: '12rem', cursor: 'pointer', display: 'flex', alignContent: "center", justifyContent: "center", flexDirection: "column", textAlign: "center" }}>
                                        <h2>{account.name}</h2>
                                        <h4>Balance: <span style={{ color: 'blue' }}>{currencies.length ? currencies.find(currency => currency.acronym == account.currencyAcronym)?.symbol : ""}{totals.totals?.length && totals.totals.find(total => total?._id == account.name)?.total || "0"}</span></h4>
                                    </Paper>
                                )}
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: "center",
                                alignItems: 'center',
                                flexWrap: "wrap",
                                '& > :not(style)': {
                                    margin: '0 1rem 1rem 0'
                                }
                            }}>
                                {currencies.map(currency =>
                                    <Paper onClick={() => navigate(`/transactions?currencyAcronym=${currency.acronym}`)} key={currency._id} sx={{ width: '12rem', height: '12rem', cursor: 'pointer', display: 'flex', alignContent: "center", justifyContent: "center", flexDirection: "column", textAlign: "center" }}>
                                        <h2>Total {currency.acronym}</h2>
                                        <h4>Balance: <span style={{ color: 'blue' }}>{currency.symbol}{totals.totalsByCurrency?.length && totals.totalsByCurrency.find(total => total?._id == currency.acronym)?.total || "0"}</span></h4>
                                    </Paper>
                                )}
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