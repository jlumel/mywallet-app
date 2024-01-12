import { Container, Box, Typography, Grid, Paper, Select, FormControl, MenuItem, Button } from "@mui/material"
import { styled } from '@mui/material/styles'
import { useUserContext } from "../../context/userContext"
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded'
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import PostAddRoundedIcon from '@mui/icons-material/PostAddRounded'
import { useNavigate } from "react-router-dom"
import './LoggedInMenu.css'
import PageTitle from '../PageTitle'
import logo from '../../assets/logo.ico'
import { useEffect, useState } from "react"
import { fetchAPI, updateData } from "../../utils"
import SubmitAlert from "../SubmitAlert"
import Loader from '../Loader'

const LoggedInMenu = () => {

    const { username, token, accounts, currencies, setAccounts, setCategories, setSubcategories } = useUserContext()

    const [formData, setFormData] = useState({
        currencyAcronym: ""
    })

    const [loading, setLoading] = useState(false)

    const [submit, setSubmit] = useState(false)

    const [alert, setAlert] = useState(false)

    const [error, setError] = useState(false)

    const [errorText, setErrorText] = useState("")

    const navigate = useNavigate()

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(8),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        cursor: 'pointer',
    }))

    const handleChange = event => {
        setFormData({ currencyAcronym: event.target.value })
    }

    const handleSubmit = event => {
        event.preventDefault()

        fetchAPI('post', '/api/user/firstLogin', formData, token)
            .then(res => {
                if (!res.data) {
                    setAlert(true)
                    setErrorText(res.response.data.message)
                    setError(true)
                }

                setFormData(
                    {
                        currencyAcronym: ""
                    }
                )
                setSubmit(true)
            })
            .catch(err => {
                setError(true)
                setErrorText("An error has ocurred")
                setSubmit(true)
                return err
            })
    }

    const handleMenu = event => {

        switch (event.target.innerText) {

            case 'Transactions':
                navigate('/transactions')
                break

            case 'Accounts':
                navigate('/accounts')
                break

            case 'Wallet Items':
                navigate('/wallet-items')
                break
        }
    }

    useEffect(() => {

        if (submit) {
            if (alert) {
                setTimeout(() => {
                    setAlert(false)
                }, 6000)
            } else {
                setLoading(true)
                updateData({ setAccounts, setCategories, setSubcategories }, token)
                    .then(res => {
                        navigate('/')
                        setLoading(false)
                    })
            }

        }

    }, [submit])

    return (
        <Container>

            <PageTitle text={'Welcome ' + username} />

            {loading ? <Loader /> : !accounts.length ? <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
                <SubmitAlert alert={alert} error={error} errorText={errorText} />
                <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>

                    <FormControl>
                        <Typography variant="h6">Select your main currency</Typography>
                        <Select
                            sx={{ margin: '1rem 0' }}
                            required={true}
                            label="Currency"
                            name="currencyAcronym"
                            value={formData.currencyAcronym}
                            fullWidth
                            onChange={handleChange}
                        >
                            {currencies.map(currency => <MenuItem key={currency._id} value={currency.acronym}>{currency.acronym}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <Button disabled={!formData.currencyAcronym} type="submit" variant="contained">Continue</Button>
                </form>
            </Box>
                :
                <Box sx={{
                    height: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
                }}>
                    <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 2 }}>
                        <Grid item xs={6}>
                            <Item className="items" onClick={handleMenu}><ListAltRoundedIcon fontSize="large" /><Typography fontWeight="bold">Transactions</Typography></Item>
                        </Grid>
                        <Grid item xs={6}>
                            <Item className="items" onClick={handleMenu}><AccountBalanceWalletRoundedIcon fontSize="large" /><Typography fontWeight="bold">Accounts</Typography></Item>
                        </Grid>
                        <Grid item xs={6}>
                            <Item className="items" onClick={handleMenu}><PostAddRoundedIcon fontSize="large" /><Typography fontWeight="bold">Wallet Items</Typography></Item>
                        </Grid>
                        <Grid item xs={6}>
                            <Item className="logoItem"><img className="logoMenu" src={logo} alt="my wallet" /></Item>
                        </Grid>
                    </Grid>

                </Box>}
        </Container>
    )
}

export default LoggedInMenu