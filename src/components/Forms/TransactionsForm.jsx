import { useState } from 'react'
import { Button, Modal, TextField, Box, Typography, FormControl, InputLabel, Select, MenuItem, Fab } from '@mui/material'
import { styled } from '@mui/system'
import { useUserContext } from '../../context/userContext'
import { fetchAPI } from '../../utils'
import EditIcon from '@mui/icons-material/Edit'
import './TransactionsForm.css'

const StyledSelect = styled(Select)(({ theme }) => ({
    [theme.breakpoints.down('xl')]: {
        height: '2.5rem'
    }
}))

const TransactionsForm = ({ setAlert, setError, setErrorText }) => {

    const padding = window.innerWidth > 1545 ? '1rem' : '0.5rem'

    const uniqueCurrencies = new Set()

    const { token, accounts, currencies, categories, subcategories } = useUserContext()

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
                        setTimeout(() => {
                            setAlert(false)
                        }, 3000)
                    } else {
                        setAlert(true)
                        setError(false)
                        setErrorText("")
                        setTimeout(() => {
                            setAlert(false)
                        }, 3000)
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
                })
                .catch(err => {
                    setAlert(true)
                    setError(true)
                    setErrorText("Internal server error")
                    setTimeout(() => {
                        setAlert(false)
                    }, 3000)
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
        height: "42rem",
        [theme.breakpoints.down('xl')]: {
            width: '15rem',
            height: '30rem'
        }
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

                    <form className="add-transaction" onSubmit={handleSubmit}>
                        <Typography textAlign="center" variant="h4">Add transaction</Typography>

                        <FormControl fullWidth margin="normal">
                            <InputLabel htmlFor="type">Type</InputLabel>
                            <StyledSelect
                                required={true}
                                id="type"
                                value={formData.type}
                                label="Type"
                                onChange={handleChange("type")}
                                name="type"
                            >
                                <MenuItem value="debit">Debit</MenuItem>
                                <MenuItem value="credit">Credit</MenuItem>
                            </StyledSelect>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel htmlFor="currencyAcronym">Currency</InputLabel>
                            <StyledSelect
                                required={true}
                                id="currencyAcronym"
                                value={formData.currencyAcronym}
                                label="Currency"
                                onChange={handleChange("currencyAcronym")}
                                name="currencyAcronym"
                                disabled={accounts.length ? false : true}
                            >
                                {
                                    accounts.length
                                        ?
                                        accounts.map(account => {

                                            const matchingCurrency = currencies.find(currency => account.currencyAcronym == currency.acronym)
                                            if (matchingCurrency && !uniqueCurrencies.has(matchingCurrency.acronym)) {
                                                uniqueCurrencies.add(matchingCurrency.acronym)

                                                return <MenuItem key={account.currencyAcronym} value={account.currencyAcronym}>{account.currencyAcronym}</MenuItem>
                                            }
                                            return null
                                        })
                                        :
                                        <MenuItem selected value="No currencies found">No currencies found</MenuItem>
                                }


                            </StyledSelect>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel htmlFor="accountName">Account</InputLabel>
                            <StyledSelect
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


                            </StyledSelect>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel htmlFor="categoryName">Category</InputLabel>
                            <StyledSelect
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


                            </StyledSelect>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel htmlFor="subcategoryName">Subcategory</InputLabel>
                            <StyledSelect
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


                            </StyledSelect>
                        </FormControl>

                        <TextField
                            inputProps={{ style: { padding } }}
                            required={true}
                            label="Amount"
                            name="amount"
                            fullWidth
                            margin="normal"
                            error={errorAmount}
                            helperText={errorAmount && "Type only numbers"}
                        />

                        <TextField
                            inputProps={{ style: { padding } }}
                            label="Description"
                            name="description"
                            fullWidth
                            margin="normal"
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button className='add-transaction-button' type="submit" variant="contained" color="primary">
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