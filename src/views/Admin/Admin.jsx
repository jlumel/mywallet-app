import PageTitle from "../../components/PageTitle/PageTitle"
import { useEffect, useState } from "react"
import { updateSession } from '../../utils'
import Loader from '../../components/Loader'
import { useUserContext } from "../../context/userContext"
import { Container, Box, Typography, Grid, Paper } from "@mui/material"
import { styled } from '@mui/material/styles'
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded'
import CreateNewFolderRoundedIcon from '@mui/icons-material/CreateNewFolderRounded'
import { useNavigate } from "react-router-dom"

const Admin = () => {

    document.title = 'My Wallet | Wallet Items'
    
    const { isLogged, token, setToken, setIsLogged, setUsername } = useUserContext()

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(8),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        cursor: 'pointer',
        '& > p': {
            fontSize: '1.7rem',
            [theme.breakpoints.down('sm')]: {
                fontSize: '1.3rem',
            },
            [theme.breakpoints.up('sm')]: {
                fontSize: '1.7rem',
            },
            margin: '0.2rem'
        },
        '& > p > span': {
            fontSize: '1rem',
            margin: '0.2rem',
            display: 'block',
            fontWeight: 'lighter',
            [theme.breakpoints.down('sm')]: {
                fontSize: '0.8rem',
            },
            [theme.breakpoints.up('sm')]: {
                fontSize: '1rem',
            }
        }
    }))

    const handleMenu = event => {

        if (event.target.tagName.toLowerCase() === 'path') {
            const dataId = event.target.parentNode.getAttribute('data-id')
            navigate(`/wallet-items/${dataId}`)
        } else {
            navigate(`/wallet-items/${event.target.dataset.id}`)
        }
    }

    useEffect(() => {

        !isLogged && navigate('/')

        setLoading(true)

        updateSession(setIsLogged, setUsername, token, setToken)
            .finally(() => {
                setLoading(false)
            })

    }, [])



    return (
        <>
            {loading ? <Loader /> :

                <Container>

                    <PageTitle text="Wallet Items" />

                    <Box sx={{
                        height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
                    }}>
                        <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 2 }}>
                            <Grid item xs={6}>
                                <Item data-id="create" onClick={handleMenu}>
                                    <CreateNewFolderRoundedIcon data-id="create" fontSize="large" />
                                    <Typography data-id="create" fontWeight="bold">Create<span>(Accounts, categories and subcategories)</span></Typography>
                                </Item>
                            </Grid>
                            <Grid item xs={6}>
                                <Item data-id="modify" onClick={handleMenu}>
                                    <BorderColorRoundedIcon data-id="modify" fontSize="large" />
                                    <Typography data-id="modify" fontWeight="bold">Modify/Delete<span>(Accounts, categories and subcategories)</span> </Typography>
                                </Item>
                            </Grid>
                        </Grid>
                    </Box>

                </Container>}
        </>
    )
}

export default Admin