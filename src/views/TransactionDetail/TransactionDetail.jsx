import { Container, Box, Paper, Button, Select, MenuItem, TextField, Typography } from "@mui/material"
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useParams } from "react-router-dom"
import { useUserContext } from '../../context/userContext'
import { useEffect, useState } from "react"
import Loader from "../../components/Loader"
import { updateData, fetchAPI, capitalizeFirstLetter } from "../../utils"
import ConfirmationModal from "../../components/Modal"
import SubmitAlert from "../../components/SubmitAlert"
import { useNavigate } from "react-router-dom"
import './TransactionDetail.css'
import styled from "@emotion/styled"

const StyledPaper = styled(Paper)(({ theme }) => ({
    [theme.breakpoints.down('xl')]: {
        height: '60vh',
        width: '30vw',
        fontSize: '1.2rem'
    },
    [theme.breakpoints.down('md')]: {
        height: '30vh',
        width: '70vw',
        fontSize: '1rem'
    }
}))

const StyledSelect = styled(Select)(({ theme }) => ({
    [theme.breakpoints.down('xl')]: {
        margin: '1.3rem 0 auto',
        height: '1rem'
    },
    [theme.breakpoints.down('md')]: {
        margin: '1rem 0 auto',
        height: '1rem'
    }
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
    [theme.breakpoints.down('xl')]: {
        width: '8rem',
        margin: '1.1rem 0 auto',
    },
    [theme.breakpoints.down('md')]: {
        width: '8rem',
        margin: '0.8rem 0 auto',
    }
}))

const TransactionDetail = () => {

    document.title = 'My Wallet | Transaction detail'

    const navigate = useNavigate()

    const { id } = useParams()

    const { isLogged, token, transactions, currencies, categories, subcategories, setTransactions, setCategories, setSubcategories } = useUserContext()

    const [loading, setLoading] = useState(false)

    const [transaction, setTransaction] = useState({})

    const [formData, setFormData] = useState({
        categoryName: "",
        subcategoryName: "",
        amount: "",
        description: "",
        timestamp: "",
    })

    const [alert, setAlert] = useState(false)

    const [error, setError] = useState(false)

    const [errorText, setErrorText] = useState("")

    const [deleted, setDeleted] = useState(false)

    const [edit, setEdit] = useState(false)

    const toggleEdit = action => {

        if (action == "confirm") {

            fetchAPI('put', `/api/transactions/${id}`, formData, token)
                .then(res => {
                    if (!res.data) {
                        setErrorText(res.response.data.message)
                        setError(true)
                        setAlert(true)
                        setTimeout(() => {
                            setAlert(false)
                        }, 3000)
                    } else {
                        setError(false)
                        setErrorText("")
                    }
                    setEdit(prev => !prev)
                })
                .catch(err => {
                    setError(true)
                    setErrorText("Internal server error")
                    setAlert(true)
                    setTimeout(() => {
                        setAlert(false)
                    }, 3000)
                    return err
                })
        } else {
            setEdit(prev => !prev)
        }
    }

    const handleChange = prop => event => {

        setFormData({ ...formData, [prop]: event.target.value ? event.target.value : "" })
    }

    const handleAmountChange = event => {
        if (event.target.value.includes("-") || event.target.value.includes("+") || isNaN(event.target.value)) {
            return
        }
        setFormData({ ...formData, amount: event.target.value ? event.target.value : "" })
    }

    const handleDelete = () => {

        fetchAPI('delete', `/api/transactions/${id}`, null, token)
            .then(res => {
                if (!res.data) {
                    setErrorText(res.response.data.message)
                    setError(true)
                    setAlert(true)
                    setTimeout(() => {
                        setAlert(false)
                    }, 3000)
                } else {
                    setError(false)
                    setErrorText("")
                    setAlert(true)
                    setDeleted(true)
                    setTimeout(() => {
                        setAlert(false)
                    }, 3000)
                }
            })
            .catch(err => {
                setError(true)
                setErrorText("Internal server error")
                setTimeout(() => {
                    setAlert(false)
                }, 3000)
                return err
            })
    }

    useEffect(() => {

        !isLogged && navigate('/')

        setLoading(true)
        updateData({ setTransactions, setCategories, setSubcategories }, token)
            .finally(() => {
                setLoading(false)
            })
    }, [])

    useEffect(() => {

        if (deleted) {
            updateData({ setTransactions }, token)
                .finally(() => {
                    navigate('/transactions')
                })
        }

    }, [alert])

    useEffect(() => {

        transactions.length && setTransaction(transactions.find(transaction => transaction._id == id))

        setFormData({

            categoryName: transaction.categoryName,
            subcategoryName: transaction.subcategoryName,
            amount: transaction.amount,
            description: transaction.description,
            timestamp: new Date(transaction.timestamp).toLocaleDateString()
        })

    }, [transactions])

    return (
        <>
            {loading ? <Loader /> :
                <Container>
                    {Object.keys(transaction).length ?
                        <>
                            <SubmitAlert alert={alert} error={error} errorText={errorText} />
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                marginTop: '5rem'
                            }}>
                                {edit ?
                                    <StyledPaper sx={{ cursor: 'pointer', textAlign: 'left', fontSize: '2rem', width: '50%', margin: 'auto', padding: '0 2rem' }}>
                                        <p style={{ marginBottom: '0' }}><span className="titles">Account: </span>{transaction.accountName}</p>
                                        <Box sx={{ display: 'flex' }}>
                                            <p style={{ marginBottom: '0' }}><span className="titles">Category: </span>
                                            </p>
                                            <StyledSelect sx={{ height: '1.5rem', margin: '2.5rem 0 auto' }} name="categoryName" value={formData.categoryName} onChange={handleChange('categoryName')}>
                                                {categories.map(category =>
                                                    <MenuItem key={category._id} value={category.name}>{category.name}</MenuItem>)}
                                            </StyledSelect>
                                        </Box>
                                        <Box sx={{ display: 'flex' }}>
                                            <p style={{ marginBottom: '0' }}><span className="titles">Subcategory: </span>
                                            </p>
                                            <StyledSelect sx={{ height: '1.5rem', margin: '2.5rem 0 auto' }} name="subcategoryName" value={formData.subcategoryName} onChange={handleChange('subcategoryName')}>
                                                {
                                                    subcategories.find(item => item.categoryName == formData.categoryName) ? subcategories.map(item =>
                                                        item.categoryName == formData.categoryName && <MenuItem key={item._id} value={item.name}>{item.name}</MenuItem>
                                                    )
                                                        :
                                                        <MenuItem selected value={`No subcategories found`}>No subcategories found</MenuItem>}
                                            </StyledSelect>
                                        </Box>
                                        <p><span className="titles">Currency: </span>{transaction.currencyAcronym}</p>
                                        <p style={{ marginBottom: '0' }}><span className="titles">Type: </span>{transaction.type ? capitalizeFirstLetter(transaction.type) : ""}</p>
                                        <Box sx={{ display: 'flex' }}>
                                            <p style={{ marginBottom: '0' }}><span className="titles">Amount: </span>{transaction.type == "debit" && "-"}{currencies.length && currencies.find(currency => currency.acronym == transaction.currencyAcronym)?.symbol}</p>
                                            <StyledTextField sx={{ width: '10rem', margin: '2.5rem 0 auto' }} inputProps={{ style: { padding: '0 0' } }} type="text" value={formData.amount} onChange={handleAmountChange} />
                                        </Box>
                                        <Box sx={{ display: 'flex' }}>
                                            <p style={{ marginBottom: '0' }}><span className="titles">Description: </span></p>
                                            <StyledTextField sx={{ width: '12rem', margin: '2.5rem 0 auto' }} inputProps={{ style: { padding: '0 0' } }} type="text" value={formData.description} onChange={handleChange('description')} />
                                        </Box>
                                        <p><span className="titles">Date: </span></p><LocalizationProvider dateAdapter={AdapterDayjs}><DatePicker
                                            value={formData.timestamp} onChange={handleChange('timestamp')}
                                        /></LocalizationProvider>
                                    </StyledPaper>
                                    :
                                    <StyledPaper sx={{ cursor: 'pointer', textAlign: 'left', fontSize: '2rem', width: '50%', margin: 'auto', padding: '0 2rem' }}>
                                        <p><span className="titles">Account: </span>{transaction.accountName}</p>
                                        <p><span className="titles">Category: </span>{formData.categoryName}</p>
                                        {formData.subcategoryName ? <p><span className="titles">Subcategory: </span>{formData.subcategoryName}</p> : <p>Subcategory: -</p>}
                                        <p><span className="titles">Currency: </span>{transaction.currencyAcronym}</p>
                                        <p><span className="titles">Type: </span>{transaction.type ? capitalizeFirstLetter(transaction.type) : ""}</p>
                                        <p><span className="titles">Amount: </span>{transaction.type == "debit" && "-"}{currencies.length && currencies.find(currency => currency.acronym == transaction.currencyAcronym)?.symbol}{formData.amount}</p>
                                        <p><span className="titles">Description: </span>{formData.description || "-"}</p>
                                        <p><span className="titles">Date: </span>{new Date(transaction.timestamp).toLocaleDateString()} {new Date(transaction.timestamp).toLocaleTimeString()}</p>
                                    </StyledPaper>
                                }

                                {
                                    !edit ? <Box sx={{ margin: '1.5rem auto 0 auto', display: 'flex', justifyContent: 'space-around', width: '20%' }}>
                                        <Button sx={{ width: '40%' }} disabled={deleted} variant="contained" onClick={toggleEdit}>Edit</Button>

                                        <ConfirmationModal isDeleteButtonDisbaled={deleted} handleDelete={handleDelete} />
                                    </Box>
                                        :
                                        <Box sx={{ margin: '1.5rem auto 0 auto', display: 'flex', justifyContent: 'space-around', width: '20%' }}>
                                            <Button sx={{ width: '40%' }} color="success" variant="contained" onClick={() => toggleEdit('confirm')}>Confirm</Button>
                                            <Button sx={{ width: '40%' }} color="error" variant="contained" onClick={() => toggleEdit('cancel')}>Cancel</Button>
                                        </Box>
                                }
                            </Box>
                        </>
                        :
                        <Box sx={{ marginTop: '18rem', display: 'flex', justifyContent: 'center' }}>
                            <Typography variant="h4">Transaction not found 	&#9888;</Typography>
                        </Box>
                    }
                </Container>}
        </>
    )

}

export default TransactionDetail