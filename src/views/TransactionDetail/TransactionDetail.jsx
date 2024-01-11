import { Container, Box, Paper, Button, Select, MenuItem, TextField } from "@mui/material"
import { useParams } from "react-router-dom"
import { useUserContext } from '../../context/userContext'
import { useEffect, useState } from "react"
import Loader from "../../components/Loader"
import { updateData, fetchAPI, capitalizeFirstLetter } from "../../utils"
import ConfirmationModal from "../../components/Modal"
import SubmitAlert from "../../components/SubmitAlert"
import { useNavigate } from "react-router-dom"

const TransactionDetail = () => {

    const navigate = useNavigate()

    const { id } = useParams()

    const { isLogged, token, transactions, currencies, categories, subcategories, setTransactions, setCurrencies, setCategories, setSubcategories } = useUserContext()

    const [loading, setLoading] = useState(false)

    const [transaction, setTransaction] = useState({})

    const [formData, setFormData] = useState({
        categoryName: "",
        subcategoryName: "",
        amount: "",
        description: "",
    })

    const [submit, setSubmit] = useState(false)

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
                    } else {
                        setError(false)
                        setErrorText("")
                    }
                    setSubmit(true)
                    setEdit(prev => !prev)
                })
                .catch(err => {
                    setError(true)
                    setErrorText("An error has ocurred")
                    setSubmit(true)
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
                    setSubmit(true)
                } else {
                    setError(false)
                    setErrorText("")
                    setDeleted(true)
                    setSubmit(true)
                    navigate()
                }
            })
            .catch(err => {
                setError(true)
                setErrorText("An error has ocurred")
                setSubmit(true)
                return err
            })
    }

    useEffect(() => {

        !isLogged && navigate('/')

        setLoading(true)
        updateData({ setTransactions, setCurrencies, setCategories, setSubcategories }, token)
            .finally(() => {
                setLoading(false)
            })
    }, [])

    useEffect(() => {

        submit ? setAlert(true) : null
        setTimeout(() => {
            submit ? setAlert(false) : null
            if (deleted) {
                navigate('/transactions')
            }
        }, 6000)

    }, [submit])

    useEffect(() => {

        transactions.length && setTransaction(transactions.find(transaction => transaction._id == id))

        setFormData({

            categoryName: transaction.categoryName,
            subcategoryName: transaction.subcategoryName,
            amount: transaction.amount,
            description: transaction.description,
        })

    }, [transactions])

    return (
        <>
            {loading ? <Loader /> : <Container>
                <SubmitAlert alert={alert} error={error} errorText={errorText} />
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    marginTop: '6rem'
                }}>
                    {edit ?
                        <Paper sx={{ cursor: 'pointer', textAlign: 'center', fontSize: '2rem', width: '50%', margin: 'auto' }}>
                            <p style={{ marginBottom: '0' }}>Account: {transaction.accountName}</p>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <p style={{ marginBottom: '0' }}>Category:
                                </p>
                                <Select sx={{ height: '1.5rem', margin: '2.5rem 0 auto' }} name="categoryName" value={formData.categoryName} onChange={handleChange('categoryName')}>
                                    {categories.map(category =>
                                        <MenuItem key={category._id} value={category.name}>{category.name}</MenuItem>)}
                                </Select>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <p style={{ marginBottom: '0' }}>Subcategory:
                                </p>
                                <Select sx={{ height: '1.5rem', margin: '2.5rem 0 auto' }} name="subcategoryName" value={formData.subcategoryName} onChange={handleChange('subcategoryName')}>
                                    {subcategories.find(item => item.categoryName == formData.categoryName) ? subcategories.map(item =>
                                        item.categoryName == formData.categoryName && <MenuItem key={item._id} value={item.name}>{item.name}</MenuItem>
                                    ) : <MenuItem selected value={`No subcategories found`}>No subcategories found</MenuItem>}
                                </Select>
                            </Box>
                            <p>Currency: {transaction.currencyAcronym}</p>
                            <p style={{ marginBottom: '0' }}>Type: {transaction.type ? capitalizeFirstLetter(transaction.type) : ""}</p>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <p style={{ marginBottom: '0' }}>Amount: {transaction.type == "debit" && "-"}{currencies.length && currencies.find(currency => currency.acronym == transaction.currencyAcronym)?.symbol}</p>
                                <TextField sx={{ '& .MuiInputBase-root': { padding: '0' }, width: '10rem', height: '1.7rem', margin: '2.5rem 0 auto' }} type="text" value={formData.amount} onChange={handleAmountChange} />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <p style={{ marginBottom: '0' }}>Description: </p>
                                <TextField sx={{ '& .MuiInputBase-root': { padding: '0' }, width: '8.7rem', height: '1.7rem', margin: '2.5rem 0 auto' }} type="text" value={formData.description} onChange={handleChange('description')} />
                            </Box>
                            <p>Date: {new Date(transaction.timestamp).toLocaleDateString()} {new Date(transaction.timestamp).toLocaleTimeString()}</p>
                        </Paper>
                        :
                        <Paper sx={{ cursor: 'pointer', textAlign: 'center', fontSize: '2rem', width: '50%', margin: 'auto' }}>
                            <p>Account: {transaction.accountName}</p>
                            <p>Category: {formData.categoryName}</p>
                            {formData.subcategoryName ? <p>Subcategory: {formData.subcategoryName}</p> : <p>Subcategory: -</p>}
                            <p>Currency: {transaction.currencyAcronym}</p>
                            <p>Type: {transaction.type ? capitalizeFirstLetter(transaction.type) : ""}</p>
                            <p>Amount: {transaction.type == "debit" && "-"}{currencies.length && currencies.find(currency => currency.acronym == transaction.currencyAcronym)?.symbol}{formData.amount}</p>
                            <p>Description: {transaction.description || "-"}</p>
                            <p>Date: {new Date(transaction.timestamp).toLocaleDateString()} {new Date(transaction.timestamp).toLocaleTimeString()}</p>
                        </Paper>}

                    {!edit ? <Box sx={{ margin: '2rem auto', display: 'flex', justifyContent: 'space-around', width: '20%' }}>
                        <Button sx={{ width: '40%' }} disabled={deleted} variant="contained" onClick={toggleEdit}>Edit</Button>

                        <ConfirmationModal isDeleteButtonDisbaled={deleted} handleDelete={handleDelete} />
                    </Box>
                        :
                        <Box sx={{ margin: '2rem auto', display: 'flex', justifyContent: 'space-around', width: '20%' }}>
                            <Button sx={{ width: '40%' }} color="success" variant="contained" onClick={() => toggleEdit('confirm')}>Confirm</Button>
                            <Button sx={{ width: '40%' }} color="error" variant="contained" onClick={() => toggleEdit('cancel')}>Cancel</Button>
                        </Box>}

                </Box>
            </Container>}
        </>
    )

}

export default TransactionDetail