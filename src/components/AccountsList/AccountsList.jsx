import { Paper, Box, Container } from "@mui/material"
import { useState, useEffect } from "react"
import { useUserContext } from "../../context/userContext"
import { updateData, fetchAPI } from "../../utils"
import Loader from '../Loader'
import { useNavigate } from "react-router-dom"

const AccountsList = () => {

    const uniqueCurrencies = new Set()

    const navigate = useNavigate()

    const { token, accounts, currencies, setAccounts, setAccountFilter, setCurrencyFilter } = useUserContext()

    const [loading, setLoading] = useState(false)

    const [totals, setTotals] = useState([])

    const handleClick = query => {
        if (query.key == 'accountName') {
            setAccountFilter({ active: true, param: { key: query.key, value: query.value } })
            navigate('/transactions')
        } else {
            setCurrencyFilter({ active: true, param: { key: query.key, value: query.value } })
            navigate('/transactions')
        }
    }

    useEffect(() => {
        setLoading(true)
        updateData({ setAccounts }, token)
            .then(() => {
                fetchAPI('post', '/api/accounts/totals', null, token)
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
                            <Paper onClick={() => handleClick({ key: 'accountName', value: account.name })} key={account._id} sx={{ width: '12rem', height: '12rem', cursor: 'pointer', display: 'flex', alignContent: "center", justifyContent: "center", flexDirection: "column", textAlign: "center" }}>
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
                        {
                            accounts.map(account => {

                                const matchingCurrency = currencies.find(currency => account.currencyAcronym == currency.acronym)
                                if (matchingCurrency && !uniqueCurrencies.has(matchingCurrency.acronym)) {
                                    uniqueCurrencies.add(matchingCurrency.acronym)

                                    return <Paper onClick={() => handleClick({ key: 'currencyAcronym', value: account.currencyAcronym })} key={account.currencyAcronym} sx={{ width: '12rem', height: '12rem', cursor: 'pointer', display: 'flex', alignContent: "center", justifyContent: "center", flexDirection: "column", textAlign: "center" }}>
                                        <h2>Total {account.currencyAcronym}</h2>
                                        <h4>Balance: <span style={{ color: 'blue' }}>{currencies.find(currency => account.currencyAcronym == currency.acronym)?.symbol}{totals.totalsByCurrency?.length && totals.totalsByCurrency.find(total => total?._id == account.currencyAcronym)?.total || "0"}</span></h4>
                                    </Paper>
                                }
                                return null
                            }
                            )}
                    </Box>
                </Box>
            </Box>
            </Container>}
        </>
    )
}

export default AccountsList