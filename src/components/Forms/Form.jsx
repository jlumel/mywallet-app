import React, { useEffect, useState } from 'react'
import { useUserContext } from "../../context/userContext"
import { fetchAPI, updateSession } from '../../utils'
import { TextField, FormControlLabel, Checkbox, Button, Container, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Loader from '../Loader'
import SubmitAlert from '../SubmitAlert'

const Form = ({ type }) => {

    const navigate = useNavigate()

    const { token, setUsername, setIsLogged, setToken } = useUserContext()

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        password2: '',
        newPassword: '',
        showPassword: false
    })

    const [loading, setLoading] = useState(false)

    const [errorPass, setErrorPass] = useState(false)

    const [errorPass2, setErrorPass2] = useState(false)

    const [submit, setSubmit] = useState(false)

    const [alert, setAlert] = useState(false)

    const [error, setError] = useState(false)

    const [errorText, setErrorText] = useState("")

    const isButtonDisabled = type == "Log In" && (!formData.username || !formData.password) ||
        type == "Register" && (!formData.username || formData.password.length < 4 || !formData.password2 || formData.password !== formData.password2) ||
        type == "Change pasword" && formData.newPassword.length < 4

    const handleSubmit = event => {
        event.preventDefault()

        switch (type) {
            case 'Log In':
                setLoading(true)
                fetchAPI('post', '/user/login', formData)
                    .then(res => {
                        if (!res.data) {
                            setErrorText(res.response.data.message)
                            setError(true)
                        } else {
                            setError(false)
                            setErrorText("")
                        }
                        if (res.data.username) {
                            setIsLogged(true)
                            setUsername(res.data.username)
                            setToken(res.data.token)
                            localStorage.setItem('token', res.data.token)
                            setLoading(false)
                            navigate('/')
                        } else {
                            setLoading(false)
                        }
                        setSubmit(true)
                    })
                    .catch(err => {
                        setLoading(false)
                        setError(true)
                        setSubmit(true)
                        return err
                    })
                    .finally(() => {
                        setErrorPass(false)
                        setFormData({
                            username: '',
                            password: '',
                            password2: '',
                            newPassword: '',
                            showPassword: false
                        })
                    })

                break

            case 'Register':
                setLoading(true)
                fetchAPI('post', '/user/register', formData)
                    .then(res => {
                        if (!res.data) {
                            setErrorText(res.response.data.message)
                            setError(true)
                        } else {
                            setError(false)
                            setErrorText("")
                            navigate('/login')
                        }
                        setLoading(false)
                        setSubmit(true)
                    })
                    .catch(err => {
                        setLoading(false)
                        setError(true)
                        setErrorText("An error has ocurred")
                        setSubmit(true)
                        return err
                    })
                    .finally(() => {
                        setErrorPass(false)
                        setErrorPass2(false)
                        setFormData({
                            username: '',
                            password: '',
                            password2: '',
                            newPassword: '',
                            showPassword: false
                        })
                    })

                break

            case 'Change password':
                setLoading(true)
                fetchAPI('put', '/api/user/password', formData, token)
                    .then(res => {
                        if (!res.data) {
                            setErrorText(res.response.data.message)
                            setError(true)
                        } else {
                            setError(false)
                            setErrorText("")
                        }
                        setLoading(false)
                        setSubmit(true)
                    })
                    .catch(err => {
                        setLoading(false)
                        setError(true)
                        setErrorText("An error has ocurred")
                        setSubmit(true)
                        return err
                    })
                    .finally(() => {
                        setErrorPass(false)
                        setFormData({
                            username: '',
                            password: '',
                            password2: '',
                            newPassword: '',
                            showPassword: false
                        })
                    })

                break
        }
    }

    const handleChange = prop => event => {
        setFormData({ ...formData, [prop]: event.target.value })
        prop == "password2" && formData.password !== formData.password2 && setErrorPass2(true)
        prop == "password" && formData.password.length < 4 && setErrorPass(true)
        prop == "newPassword" && formData.newPassword.length < 4 && setErrorPass(true)
    }

    const handleCheckboxChange = () => {
        setFormData({ ...formData, showPassword: !formData.showPassword })
    }

    useEffect(() => {

        setLoading(true)
        updateSession(setIsLogged, setIsLogged, token, setToken)
            .finally(() => {
                submit && setAlert(true)
                setTimeout(() => {
                    submit && setAlert(false)
                }, 3000)
                setLoading(false)
                setLoading(false)
            })

    }, [submit])

    useEffect(() => {

        setSubmit(false)

    }, [loading])

    return (

        <>
            {loading ? <Loader /> : <Container maxWidth="xs">
                <SubmitAlert alert={alert} error={error} errorText={errorText} />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        {type != 'Change password' && <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={formData.username}
                            onChange={handleChange('username')}
                        />}
                        {type != "Change password" && <TextField
                            margin="normal"
                            required
                            fullWidth
                            error={type == "Register" && formData.password.length < 4 && errorPass}
                            helperText={type == "Register" && formData.password.length < 4 && errorPass && "Password must be at least 4 caracters long"}
                            name="password"
                            label="Password"
                            type={formData.showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange("password")}
                        />}
                        {type == "Change password" && <TextField
                            margin="normal"
                            required
                            fullWidth
                            error={type == "Change password" && formData.newPassword.length < 4 && errorPass}
                            helperText={type == "Change password" && formData.newPassword.length < 4 && errorPass && "Password must be at least 4 caracters long"}
                            name="newPassword"
                            label="New password"
                            type={formData.showPassword ? 'text' : 'password'}
                            value={formData.newPassword}
                            onChange={handleChange("newPassword")}
                        />}
                        {type == 'Register' && <TextField
                            margin="normal"
                            required
                            type="password"
                            fullWidth
                            error={formData.password !== formData.password2 && errorPass2}
                            helperText={formData.password !== formData.password2 && errorPass2 && "Passwords do not match"}
                            name="password2"
                            label="Repeat password"
                            value={formData.password2}
                            onChange={handleChange('password2')}
                        />}
                        <FormControlLabel
                            control={<Checkbox checked={formData.showPassword} onChange={handleCheckboxChange} color="primary" />}
                            label="Show Password"
                        />
                        <Button disabled={isButtonDisabled} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            {type}
                        </Button>
                    </form>
                </Box>
            </Container>}
        </>
    )


}

export default Form