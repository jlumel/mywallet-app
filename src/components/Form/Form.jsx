import React, { useState } from 'react'
import { useUserContext } from "../../context/userContext"
import { fetchAPI } from '../../utils'
import { TextField, FormControlLabel, Checkbox, Button, Container, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Form = ({ type }) => {

    const navigate = useNavigate()

    const { setUsername, setIsLogged, token } = useUserContext()

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        password2: '',
        newPassword: '',
        showPassword: false
    })

    const [success, setSuccess] = useState(null)

    const [error, setError] = useState(false)

    const handleSubmit = event => {
        event.preventDefault()

        switch (type) {
            case 'Log In':
                fetchAPI('post', '/user/login', formData)
                    .then(data => {
                        if (data.username) {
                            setIsLogged(true)
                            setUsername(data.username)
                            localStorage.setItem("token", data.token)
                            navigate('/')
                        }
                    })
                    .catch(err => {
                        setError(true)
                        return err
                    })

                break;

            case 'Register':
                fetchAPI('post', '/user/register', formData)
                    .then(res => {
                        navigate('/login')
                    })
                    .catch(err => {
                        setError(true)
                        return err
                    })

                break;

            case 'Change password':
                fetchAPI('put', '/api/user/password', formData, token)
                    .then(res => {
                        if (res) {
                            console.log(formData)
                            setSuccess(true)
                        } else {
                            setError(true)
                        }
                    })
                    .catch(err => {
                        setError(true)
                        return err
                    })

                break;

        }

    }

    const handleChange = prop => event => {
        setFormData({ ...formData, [prop]: event.currentTarget.value });
    }

    const handleCheckboxChange = () => {
        setFormData({ ...formData })
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
                {!success ? <form onSubmit={handleSubmit}>
                    {type != 'Change password' ? <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        error={error}
                        autoFocus
                        value={formData.username}
                        onChange={handleChange('username')}
                    /> : null}
                    {type != "Change password" ? <TextField
                        margin="normal"
                        required
                        fullWidth
                        error={error}
                        name="password"
                        label="Password"
                        type={formData.showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange("password")}
                    /> : null}
                    {type == "Change password" ? <TextField
                        margin="normal"
                        required
                        fullWidth
                        error={error}
                        name="newPassword"
                        label="New password"
                        type={formData.showPassword ? 'text' : 'password'}
                        id="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange("newPassword")}
                    /> : null}
                    {type == 'Register' && <TextField
                        margin="normal"
                        required
                        type="password"
                        fullWidth
                        error={error}
                        name="password2"
                        label="Repeat password"
                        id="password2"
                        value={formData.password2}
                        onChange={handleChange('password2')}
                    />}
                    <FormControlLabel
                        control={<Checkbox checked={formData.showPassword} onChange={handleCheckboxChange} color="primary" />}
                        label="Show Password"
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        {type}
                    </Button>
                </form> : <h2>Password changed successfully!</h2>}
            </Box>
        </Container>
    );


}

export default Form