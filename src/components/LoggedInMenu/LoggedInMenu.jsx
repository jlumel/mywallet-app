import { Container, Box, Typography, Grid, Paper } from "@mui/material"
import { styled } from '@mui/material/styles'
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded'
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import PostAddRoundedIcon from '@mui/icons-material/PostAddRounded'
import { useNavigate } from "react-router-dom"
import './LoggedInMenu.css'
import PageTitle from '../PageTitle'
import logo from '../../assets/logo.ico'
import { useUserContext } from "../../context/userContext"
import { capitalizeFirstLetter } from "../../utils"

const LoggedInMenu = () => {

    const navigate = useNavigate()

    const { username } = useUserContext()

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(4),
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(8),
        },
        textAlign: 'center',
        color: theme.palette.text.secondary,
        cursor: 'pointer',
    }))

    const handleMenu = event => {

        if (event.target.tagName.toLowerCase() === 'path') {
            const dataId = event.target.parentNode.getAttribute('data-id')
            navigate(`/${dataId}`)
        } else {
            navigate(`/${event.target.dataset.id}`)
        }
    }

    return (
        <Container>

            <PageTitle text={`Welcome ${capitalizeFirstLetter(username)}`} />

            <Box sx={{
                height: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
            }}>
                <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 2 }}>
                    <Grid item xs={6}>
                        <Item data-id="transactions" onClick={handleMenu}><ListAltRoundedIcon data-id="transactions" fontSize="large" /><Typography data-id="transactions" fontWeight="bold">Transactions</Typography></Item>
                    </Grid>
                    <Grid item xs={6}>
                        <Item data-id="accounts" onClick={handleMenu}><AccountBalanceWalletRoundedIcon titleAccess="accounts" data-id="accounts" fontSize="large" /><Typography data-id="accounts" fontWeight="bold">Accounts</Typography></Item>
                    </Grid>
                    <Grid item xs={6}>
                        <Item data-id="wallet-items" onClick={handleMenu}><PostAddRoundedIcon data-id="wallet-items" fontSize="large" /><Typography data-id="wallet-items" fontWeight="bold">Wallet Items</Typography></Item>
                    </Grid>
                    <Grid item xs={6}>
                        <Item className="logoItem"><img className="logoMenu" src={logo} alt="my wallet" /></Item>
                    </Grid>
                </Grid>

            </Box>
        </Container>
    )
}

export default LoggedInMenu