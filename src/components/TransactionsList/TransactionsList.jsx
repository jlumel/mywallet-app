import { Container, Box, Pagination, Table, TableBody, TableContainer, TableHead, TableRow, Paper } from "@mui/material"
import { styled } from '@mui/material/styles'
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import { useState, useEffect } from "react"
import { useUserContext } from '../../context/userContext'
import Loader from "../Loader"
import { updateData } from "../../utils"
import TransactionsForm from "../Forms/TransactionsForm"
import SubmitAlert from "../SubmitAlert"
import { useNavigate, } from "react-router-dom"

const TransactionsList = ({ query }) => {

    const navigate = useNavigate()

    const { transactions, currencies, setTransactions, setCurrencies } = useUserContext()

    const [rows, setRows] = useState([])

    const [loading, setLoading] = useState(false)

    const [submit, setSubmit] = useState(false)

    const [alert, setAlert] = useState(false)

    const [error, setError] = useState(false)

    const [errorText, setErrorText] = useState("")

    const handleDetail = (event, id) => {
        navigate(`/transactions/${id}`)
    }

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: '#78909c',
            color: theme.palette.common.white,
            [theme.breakpoints.down('sm')]: {
                fontSize: '0.9rem',
            },
            [theme.breakpoints.up('sm')]: {
                fontSize: '1.2rem',
            }
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: '1.1rem',
            [theme.breakpoints.down('sm')]: {
                fontSize: '0.8rem',
            },
            [theme.breakpoints.up('sm')]: {
                fontSize: '1.1rem',
            }
        }
    }))

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(2n)': {
            backgroundColor: theme.palette.primary.light,
        },
        '&:last-child td, &:last-child th': {
            border: 0,
        },
        cursor: 'pointer'
    }))

    const createData = (id, type, currencyAcronym, amount, category, subcategory) => ({ id, type, currencyAcronym, amount, category, subcategory })

    useEffect(() => {

        setLoading(true)
        updateData({ setTransactions, setCurrencies })
            .finally(() => {
                setLoading(false)
                if (submit) {
                    setTimeout(() => {
                        submit ? setAlert(false) : null
                    }, 6000)
                }
            })

    }, [submit])

    useEffect(() => {

        if (Object.keys(query).length) {
            let filteredTransactions

            filteredTransactions = transactions.length ? transactions.filter(transaction => Object.entries(query).every(([key, value]) => transaction[value.key] === value.value)) : []

            filteredTransactions.length && setRows(filteredTransactions.map(transaction => createData(transaction._id, transaction.type, transaction.currencyAcronym, transaction.amount, transaction.categoryName, transaction.subcategoryName)))
        } else {
            transactions.length && setRows(transactions.map(transaction => createData(transaction._id, transaction.type, transaction.currencyAcronym, transaction.amount, transaction.categoryName, transaction.subcategoryName)))
        }


    }, [transactions])

    return (

        <>
            {loading ? <Loader /> : <Container style={{ width: '80%' }}>
                <SubmitAlert alert={alert} error={error} errorText={errorText} />
                <Box sx={{
                    marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
                }}>

                    <TableContainer component={Paper}>
                        <Table aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">Amount</StyledTableCell>
                                    <StyledTableCell align="center">Category</StyledTableCell>
                                    <StyledTableCell align="center">Subcategory</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map(row => (
                                    <StyledTableRow style={{ backgroundColor: row.type == 'debit' ? '#f44336' : '#4caf50' }} key={row.id} onClick={event => handleDetail(event, row.id)}>
                                        <StyledTableCell align="center">{row.type == 'debit' ? "-" : ""}{currencies.find(currency => currency.acronym == row.currencyAcronym).symbol}{row.amount}</StyledTableCell>
                                        <StyledTableCell align="center">{row.category}</StyledTableCell>
                                        <StyledTableCell align="center">{row.subcategory || "-"}</StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Box sx={{
                            marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
                        }}>
                            <Pagination count={10} color="primary" />
                        </Box>
                    </TableContainer>
                </Box>
                <TransactionsForm setSubmit={setSubmit} setAlert={setAlert} setError={setError} setErrorText={setErrorText} />
            </Container>}
        </>
    )
}

export default TransactionsList