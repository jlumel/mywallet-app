import { Container, Box, Typography, Grid, Paper } from "@mui/material"
import { styled } from '@mui/material/styles'
import { useUserContext } from "../../context/userContext"
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded'
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import PostAddRoundedIcon from '@mui/icons-material/PostAddRounded'
import { useNavigate } from "react-router-dom"
import './LoggedInMenu.css'
import PageTitle from '../PageTitle'
import logo from '../../assets/logo.ico'

const LoggedInMenu = () => {

    const { username } = useUserContext()

    const navigate = useNavigate()

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(8),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        cursor: 'pointer',
    }))

    const handleMenu = event => {

        switch (event.currentTarget.innerText) {

            case 'Transactions':
                navigate('/transactions')
                break;

            case 'Accounts':
                navigate('/accounts')
                break;

            case 'Wallet Items':
                navigate('/wallet-items')
                break;
        }
    }

    return (
        <Container>

            <PageTitle text={'Welcome ' + username}/>

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

            </Box>
        </Container>
    )
}

export default LoggedInMenu