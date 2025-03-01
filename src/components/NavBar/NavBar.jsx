import { useEffect, useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import './NavBar.css'
import { useUserContext } from '../../context/userContext'
import { capitalizeFirstLetter, lowercaseFirstLetter, fetchAPI } from '../../utils'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.ico'

const NavBar = () => {

    const navigate = useNavigate()

    const { isLogged, username, token, setIsLogged, setUsername, setToken } = useUserContext()

    const settings = ['Change Password', 'Logout']

    const [pages, setPages] = useState([])
    const [userIcon, setUserIcon] = useState("")

    useEffect(() => {
        if (isLogged) {
            setPages(['Menu', 'Transactions', 'Accounts', 'Wallet Items'])
            setUserIcon("")
        } else {
            setPages(['Register', 'Login'])
            setUserIcon("hideItem")
        }
    }, [isLogged])

    const [anchorElNav, setAnchorElNav] = useState(null)
    const [anchorElUser, setAnchorElUser] = useState(null)

    const handleOpenNavMenu = event => {
        setAnchorElNav(event.target)
    }
    const handleOpenUserMenu = event => {
        setAnchorElUser(event.target)
    }

    const handleCloseNavMenu = () => {
        setAnchorElNav(null)
    }

    const handleCloseUserMenu = () => {

        setAnchorElUser(null)
    }

    const manageNavigation = page => {

        switch (page) {
            case 'Menu':
                return '/'

            case 'Wallet Items':
                return 'wallet-items'

            default:
                return lowercaseFirstLetter(page)
        }
    }

    const logout = () => {

        fetchAPI('post', '/api/user/logout', null, token)
            .then(res => {
                setIsLogged(false)
                setUsername("")
                setToken("")
                localStorage.clear()
                handleCloseUserMenu('Logout')
                navigate('/')
            })
            .catch(err => {
                return err
            })
    }

    const changePassword = () => {

        handleCloseUserMenu('Change Password')
        navigate('/change-password')

    }

    return (
        <AppBar position="static">
            <Container maxWidth="x3">
                <Toolbar disableGutters>
                    <img src={logo} alt="logo" className="logo" />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href='/'
                        onClick={(e) => {
                            e.preventDefault()
                            navigate('/')
                        }}

                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >

                        My Wallet
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) =>
                            (
                                <MenuItem key={page} component={Link}
                                    to={manageNavigation(page)}>
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            )
                            )}
                        </Menu>
                    </Box>
                    <img src={logo} alt="logo" className="logoMobile" />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        onClick={(e) => {
                            e.preventDefault()
                            navigate('/')
                        }}
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        My Wallet
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                component={Link}
                                to={manageNavigation(page)}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page}
                            </Button>
                        )
                        )}
                    </Box>

                    <Box className={userIcon} sx={{ flexGrow: 0 }}>
                        <Tooltip className={userIcon} title={username}>
                            <IconButton className={userIcon} onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt={username && capitalizeFirstLetter(username)} src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            className={userIcon}
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={setting == 'Logout' ? logout : changePassword}>
                                    <Typography textAlign="center">{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default NavBar