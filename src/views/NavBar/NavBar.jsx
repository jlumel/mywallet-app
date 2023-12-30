import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import './NavBar.css'
import { useUserContext } from '../../context/userContext';
import { capitalizeFirstLetter, fetchAPI } from '../../utils';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {

    const navigate = useNavigate()

    const { isLogged, username, setIsLogged, setUsername, token } = useUserContext()

    const settings = ['Change Password', 'Logout'];

    const [pages, setPages] = useState([])
    const [userIcon, setUserIcon] = useState("")

    useEffect(() => {
        if (isLogged == true) {
            setPages(['Menu', 'Transactions', 'Accounts', 'Admin'])
            setUserIcon("")
        } else {
            setPages(['Register', 'Login'])
            setUserIcon("hideItem")
        }
    }, [isLogged])

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = event => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = event => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {

        setAnchorElUser(null);
    };

    const logout = () => {

        fetchAPI('post', '/api/user/logout', {}, token)
            .then(res => {
                setIsLogged(false)
                setUsername("")
                localStorage.clear()
                handleCloseUserMenu('Logout')
                navigate('/')
            })
            .catch(err => {
                console.log("Error trying to logout")
            })
    }

    const changePassword = () => {

        handleCloseUserMenu('Logout')
        navigate('/change-password')

    }

    return (
        <AppBar position="static">
            <Container maxWidth="x3">
                <Toolbar disableGutters>
                    <img src="favicon.ico" alt="logo" className="logo" />
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
                            {pages.map((page) => (
                                <MenuItem key={page} component={Link}
                                    to={page == 'Menu' ? "/" : "/" + page.toLowerCase()} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <img src="favicon.ico" alt="logo" className="logoMobile" />
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
                                to={page == 'Menu' ? "/" : "/" + page.toLowerCase()}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>

                    <Box className={userIcon} sx={{ flexGrow: 0 }}>
                        <Tooltip className={userIcon} title={username}>
                            <IconButton className={userIcon} onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt={capitalizeFirstLetter(username)} src="/static/images/avatar/2.jpg" />
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
    );
}

export default NavBar