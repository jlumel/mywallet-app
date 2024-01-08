import { Container, Box, Paper, Button } from "@mui/material"
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

    const { transactions, currencies, accounts, categories, subcategories, setTransactions, setCurrencies, setCategories, setSubcategories, setAccounts } = useUserContext()

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

            fetchAPI('put', `/api/transactions/${id}`, formData)
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
        if (event.target.value.includes("-") || event.target.value.includes("+") || isNaN(Number(event.target.value))) {
            return
        }
        setFormData({ ...formData, amount: event.target.value ? event.target.value : "" })
    }

    const handleDelete = () => {

        fetchAPI('delete', `/api/transactions/${id}`)
            .then(res => {
                if (!res.data) {
                    setErrorText(res.response.data.message)
                    setError(true)
                } else {
                    setError(false)
                    setErrorText("")
                    setDeleted(true)
                }
                setSubmit(true)
            })
            .catch(err => {
                setError(true)
                setErrorText("An error has ocurred")
                setSubmit(true)
                return err
            })
    }

    useEffect(() => {

        setLoading(true)
        updateData({ setTransactions, setCurrencies, setAccounts, setCategories, setSubcategories })
            .finally(() => {
                submit ? setAlert(true) : null
                setTimeout(() => {
                    submit ? setAlert(false) : null
                    if (deleted) {
                        navigate('/transactions')
                    }
                }, 6000)
                setLoading(false)
            })
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
                            <p>Account: {transaction.accountName}</p>
                            <p>Category:
                                <select name="categoryName" id="categoryName" value={formData.categoryName} onChange={handleChange('categoryName')}>
                                    {categories.map(category =>
                                        <option key={category._id} value={category.name}>{category.name}</option>)}
                                </select>
                            </p>
                            <p>Subcategory:
                                <select name="subcategoryName" id="subcategoryName" value={formData.subcategoryName} onChange={handleChange('subcategoryName')}>
                                    {subcategories.map(subcategory =>
                                        <option key={subcategory._id} value={subcategory.name}>{subcategory.name}</option>)}
                                </select>
                            </p>
                            <p>Currency: {transaction.currencyAcronym}</p>
                            <p>Type: {transaction.type ? capitalizeFirstLetter(transaction.type) : ""}</p>
                            <p>Amount: {transaction.type == "debit" && "-"}{currencies.length && currencies.find(currency => currency.acronym == transaction.currencyAcronym)?.symbol}<input type="text" value={formData.amount} onChange={handleAmountChange} /></p>
                            <p>Description: <input type="text" value={formData.description} onChange={handleChange('description')} /></p>
                            <p>Date: {new Date(transaction.timestamp).toLocaleDateString()} {new Date(transaction.timestamp).toLocaleTimeString()}</p>
                        </Paper>
                        :
                        <Paper sx={{ cursor: 'pointer', textAlign: 'center', fontSize: '2rem', width: '50%', margin: 'auto' }}>
                            <p>Account: {transaction.accountName}</p>
                            <p>Category: {transaction.categoryName}</p>
                            {transaction.subcategoryName ? <p>Subcategory: {transaction.subcategoryName}</p> : <p>Subcategory: -</p>}
                            <p>Currency: {transaction.currencyAcronym}</p>
                            <p>Type: {transaction.type ? capitalizeFirstLetter(transaction.type) : ""}</p>
                            <p>Amount: {transaction.type == "debit" && "-"}{currencies.length && currencies.find(currency => currency.acronym == transaction.currencyAcronym)?.symbol}{transaction.amount}</p>
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