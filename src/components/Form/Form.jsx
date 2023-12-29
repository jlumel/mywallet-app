import React, { useState } from 'react'
import { useUserContext } from "../../context/userContext"
import { fetchAPI } from '../../utils'
import { TextField, FormControlLabel, Checkbox, Button, Container, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Form = ({ type }) => {

    const navigate = useNavigate()

    const { setUsername, setIsLogged } = useUserContext()

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        showPassword: false,
    })

    const handleSubmit = event => {
        event.preventDefault()

        switch (type) {
            case 'login':
                fetchAPI('post', '/user/login', formData)
                .then(data => {
                    if (data.username) {
                        setIsLogged(true)
                        setUsername(data.username)
                        localStorage.setItem("token", data.token)
                        navigate('/')
                    }
                })
                .catch(err => err)
                
                break;

            case 'register':
                fetchAPI('post', '/user/register', formData)
                .then(res => {
                    navigate('/login')
                })
                .catch(err => err)
        }
        
    }

    const handleChange = prop => event => {
        setFormData({ ...formData, [prop]: event.target.value });
    }

    const handleCheckboxChange = () => {
        setFormData({ ...formData, showPassword: !formData.showPassword })
    }

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
                <form onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={formData.username}
                        onChange={handleChange('username')}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={formData.showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange('password')}
                    />
                    {type == 'register' && <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password2"
                        label="Repeat password"
                        id="password2"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange('password')}
                    />}
                    {type == 'login' && <FormControlLabel
                        control={<Checkbox checked={formData.showPassword} onChange={handleCheckboxChange} color="primary" />}
                        label="Show Password"
                    />}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        {type == 'login' ? 'Log In' : 'Register'}
                    </Button>
                </form>
            </Box>
        </Container>
    );


}

export default Form