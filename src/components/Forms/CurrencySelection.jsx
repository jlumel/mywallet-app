import { Box, Typography, Select, FormControl, MenuItem, Button } from "@mui/material"
import { useUserContext } from "../../context/userContext"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { fetchAPI, updateData } from "../../utils"
import SubmitAlert from "../SubmitAlert"

const CurrencySelection = () => {

    const navigate = useNavigate()

    const { token, currencies, setAccounts, setCategories, setSubcategories } = useUserContext()

    const [formData, setFormData] = useState({
        currencyAcronym: ""
    })

    const [submit, setSubmit] = useState(false)

    const [alert, setAlert] = useState(false)

    const [error, setError] = useState(false)

    const [errorText, setErrorText] = useState("")

    const handleChange = event => {
        setFormData({ currencyAcronym: event.target.value })
    }

    const handleSubmit = event => {
        event.preventDefault()

        fetchAPI('post', '/api/user/firstLogin', formData, token)
            .then(res => {
                if (!res.data) {
                    setErrorText(res.response.data.message)
                    setError(true)
                    setAlert(true)
                    setTimeout(() => {
                        setAlert(false)
                    }, 3000)
                } else {
                    setSubmit(true)
                }

                setFormData(
                    {
                        currencyAcronym: ""
                    }
                )
            })
            .catch(err => {
                setError(true)
                setErrorText("Internal server error")
                setAlert(true)
                setTimeout(() => {
                    setAlert(false)
                }, 3000)
                setSubmit(true)
                return err
            })
    }

    useEffect(() => {

        if (submit) {
            updateData({ setAccounts, setCategories, setSubcategories }, token)
                .then(res => {
                    navigate('/')
                })
        }

    }, [submit])


    return (

        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
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
                        {currencies.map(currency => <MenuItem key={currency._id} value={currency.acronym}>{currency.acronym} - {currency.name}</MenuItem>)}
                    </Select>
                </FormControl>
                <Button disabled={!formData.currencyAcronym} type="submit" variant="contained">Continue</Button>
            </form>
        </Box>
    )
}

export default CurrencySelection