import { useState } from 'react'
import { Button, Modal, TextField, Box, Typography, FormControl, InputLabel, Select, MenuItem, Fab } from '@mui/material'
import { styled } from '@mui/system'
import { useUserContext } from '../../context/userContext'
import { fetchAPI } from '../../utils'
import EditIcon from '@mui/icons-material/Edit'

const TransactionsForm = ({ setAlert, setError, setErrorText, setSubmit }) => {

    const { token, currencies, accounts, categories, subcategories } = useUserContext()

    const [formData, setFormData] = useState({
        type: "",
        currencyAcronym: "",
        accountName: "",
        categoryName: "",
        subcategoryName: "",
    })

    const [open, setOpen] = useState(false)

    const [errorAmount, setErrorAmount] = useState(false)

    const handleClose = () => {
        setOpen(false)
        setAlert(false)
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const handleChange = prop => event => {

        let updatedFormData = { ...formData }

        if (prop === "currencyAcronym") {
            updatedFormData = { ...updatedFormData, accountName: "" }
        } else if (prop === "categoryName") {
            updatedFormData = { ...updatedFormData, subcategoryName: "" }
        }

        updatedFormData = {
            ...updatedFormData,
            [prop]: event.target.value ? event.target.value : "",
        }

        setFormData(updatedFormData)
    }

    const handleSubmit = event => {

        event.preventDefault()

        if (isNaN(event.target.amount.value)) {
            setErrorAmount(true)
        } else {

            setErrorAmount(false)

            fetchAPI('post', `/api/transactions`, { ...formData, amount: event.target.amount.value, description: event.target.description.value }, token)
                .then(res => {
                    if (!res.data) {
                        setAlert(true)
                        setErrorText(res.response.data.message)
                        setError(true)
                    } else {
                        setAlert(true)
                        setError(false)
                        setErrorText("")
                    }
                    setFormData(
                        {
                            type: "",
                            currencyAcronym: "",
                            accountName: "",
                            categoryName: "",
                            subcategoryName: "",
                        }
                    )
                    setSubmit(true)
                })
                .catch(err => {
                    setError(true)
                    setErrorText("An error has ocurred")
                    setSubmit(true)
                    return err
                })

            handleClose()
        }
    }

    const StyledModal = styled(Modal)`
      display: flex;
      align-items: center;
      justify-content: center;
      .MuiBackdrop-root {
        background: none;
      }
    `

    const StyledPaper = styled('div')(({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #000',
        boxShadow: theme.shadows[5],
        borderRadius: 7,
        padding: theme.spacing(2, 4, 3),
        width: "20rem",
        height: "42rem"
    }))

    return (

        <>

            <Box sx={{ '& > :not(style)': { mt: 1, mr: 1 }, display: 'flex', justifyContent: 'flex-end' }}>
                <Fab onClick={handleOpen} color="primary" aria-label="add">
                    <EditIcon />
                </Fab>
            </Box>

            <StyledModal open={open} onClose={handleClose}>
                <StyledPaper>

                    <form onSubmit={handleSubmit}>
                        <Typography textAlign="center" variant="h4">Add transaction</Typography>

                        <FormControl fullWidth margin="normal">
                            <InputLabel htmlFor="type">Type</InputLabel>
                            <Select
                                required={true}
                                id="type"
                                value={formData.type}
                                label="Type"
                                onChange={handleChange("type")}
                                name="type"
                            >
                                <MenuItem value="debit">Debit</MenuItem>
                                <MenuItem value="credit">Credit</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel htmlFor="currencyAcronym">Currency</InputLabel>
                            <Select
                                required={true}
                                id="currencyAcronym"
                                value={formData.currencyAcronym}
                                label="Currency"
                                onChange={handleChange("currencyAcronym")}
                                name="currencyAcronym"
                                disabled={currencies.length ? false : true}
                            >
                                {currencies.length ? currencies.map(currency => <MenuItem key={currency._id} value={currency.acronym}>{currency.acronym}</MenuItem>)
                                    : <MenuItem selected value="No currencies found">No currencies found</MenuItem>}


                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel htmlFor="accountName">Account</InputLabel>
                            <Select
                                required={true}
                                id="accountName"
                                value={formData.accountName}
                                label="Account"
                                onChange={handleChange("accountName")}
                                name="accountName"
                                disabled={accounts.length ? false : true}
                            >
                                {accounts.length ? accounts.map(account =>
                                    formData.currencyAcronym == account.currencyAcronym && <MenuItem key={account._id} value={account.name}>{account.name}</MenuItem>)
                                    : <MenuItem selected value="No accounts found">No accounts found</MenuItem>}


                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel htmlFor="categoryName">Category</InputLabel>
                            <Select
                                required={true}
                                id="categoryName"
                                value={formData.categoryName}
                                label="Category"
                                onChange={handleChange("categoryName")}
                                name="categoryName"
                                disabled={categories.length ? false : true}
                            >
                                {categories.length ? categories.map(category => <MenuItem key={category._id} value={category.name}>{category.name}</MenuItem>)
                                    : <MenuItem selected value="No categories found">No categories found</MenuItem>}


                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel htmlFor="subcategoryName">Subcategory</InputLabel>
                            <Select
                                id="subcategoryName"
                                value={formData.subcategoryName}
                                label="Subcategory"
                                onChange={handleChange("subcategoryName")}
                                name="subcategoryName"
                                disabled={subcategories.length ? false : true}
                            >
                                {subcategories.length ? subcategories.map(subcategory =>
                                    formData.categoryName == subcategory.categoryName && <MenuItem key={subcategory._id} value={subcategory.name}>{subcategory.name}</MenuItem>)
                                    : <MenuItem selected value="No subcategories found">No subcategories found</MenuItem>}


                            </Select>
                        </FormControl>

                        <TextField
                            required={true}
                            label="Amount"
                            name="amount"
                            fullWidth
                            margin="normal"
                            error={errorAmount}
                            helperText={errorAmount && "Type only numbers"}
                        />

                        <TextField

                            label="Description"
                            name="description"
                            fullWidth
                            margin="normal"
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: '1rem' }}>
                            <Button type="submit" variant="contained" color="primary">
                                Add
                            </Button>
                        </Box>
                    </form>
                </StyledPaper>
            </StyledModal>
        </>
    )
}

export default TransactionsForm