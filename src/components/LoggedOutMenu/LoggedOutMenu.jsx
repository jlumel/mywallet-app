import React from 'react'
import { Button, Container, Box } from '@mui/material'
import { Link } from 'react-router-dom'

const LoggedOutMenu = () => {


    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <h2>Welcome to My Wallet. Please...</h2>
                <Button
                    component={Link}
                    to="/login"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2, mb: 2 }}
                >
                    Login
                </Button>
                <h2>or...</h2>
                <Button
                    component={Link}
                    to="/register"
                    fullWidth
                    variant="outlined"
                    color="primary"
                    sx={{ mb: 2 }}
                >
                    Register
                </Button>
            </Box>
        </Container>
    )
}

export default LoggedOutMenu