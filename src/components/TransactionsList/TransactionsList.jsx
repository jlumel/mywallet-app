import { Container, Box, Pagination, Table, TableBody, TableContainer, TableHead, TableRow, Paper, Chip } from "@mui/material"
import { styled } from '@mui/material/styles'
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import { useState, useEffect } from "react"
import { useUserContext } from '../../context/userContext'
import Loader from "../Loader"
import { updateData } from "../../utils"
import TransactionsForm from "../Forms/TransactionsForm"
import SubmitAlert from "../SubmitAlert"
import { useNavigate } from "react-router-dom"
import FilterMenu from "../FilterMenu/FilterMenu"

const TransactionsList = () => {

    const ROWS_PER_PAGE = 8

    const navigate = useNavigate()

    const { token, transactions, currencies, query, setTransactions, setCurrencies, setAccounts, setCategories, setSubcategories, setQuery, setAccountFilter, setCurrencyFilter, setCategoryFilter } = useUserContext()

    const [rows, setRows] = useState([])

    const [page, setPage] = useState(1)

    const [pageCount, setPageCount] = useState(0)

    const [chipData, setChipData] = useState([])

    const [loading, setLoading] = useState(false)

    const [submit, setSubmit] = useState(false)

    const [alert, setAlert] = useState(false)

    const [error, setError] = useState(false)

    const [errorText, setErrorText] = useState("")

    const handleDetail = (event, id) => {
        navigate(`/transactions/${id}`)
    }

    const handlePagination = (event, value) => {
        setPage(value)
    }

    const handleDeleteChip = key => () => {

        setChipData(chipData.filter(chip => chip.key !== key))

        setQuery(query.filter(query => query.key != key))

        key == 'accountName' && setAccountFilter({ active: false, param: { key: "accountName", value: "" } })

        key == 'currencyName' && setCurrencyFilter({ active: false, param: { key: "currencyName", value: "" } })

        key == 'categoryName' && setCategoryFilter({ active: false, param: { key: "categoryName", value: "" } })

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

    const startIndex = (page - 1) * ROWS_PER_PAGE

    const endIndex = startIndex + ROWS_PER_PAGE

    const createData = (id, type, currencyAcronym, amount, category, subcategory, account) => ({ id, type, currencyAcronym, amount, category, subcategory, account })

    const ListItem = styled('li')(({ theme }) => ({
        margin: theme.spacing(0.5),
    }))

    useEffect(() => {

        setLoading(true)
        updateData({ setTransactions, setCurrencies, setAccounts, setCategories, setSubcategories }, token)
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

            setChipData(query.map(item => ({ key: `${item.key}`, label: `${item.key}:${item.value}` })))

            let filteredTransactions

            filteredTransactions = transactions.length ? transactions.filter(transaction => Object.entries(query).every(([key, value]) => transaction[value.key] === value.value)) : []

            setRows(filteredTransactions?.map(transaction => createData(transaction._id, transaction.type, transaction.currencyAcronym, transaction.amount, transaction.categoryName, transaction.subcategoryName, transaction.accountName)))
        } else {
            setChipData([])
            transactions.length && setRows(transactions.map(transaction => createData(transaction._id, transaction.type, transaction.currencyAcronym, transaction.amount, transaction.categoryName, transaction.subcategoryName, transaction.accountName)))
        }


    }, [transactions, query])

    useEffect(() => {

        if (rows.length) {

            if (Math.floor(rows.length / ROWS_PER_PAGE) < rows.length / 8) {
                setPageCount(Math.floor(rows.length / ROWS_PER_PAGE) + 1)
            } else {
                setPageCount(Math.floor(rows.length / ROWS_PER_PAGE))
            }
        }

    }, [rows])

    return (

        <>
            {loading ? <Loader /> : <Container style={{ width: '80%' }}>
                <ul
                    style={{
                        position: 'absolute',
                        top: 145,
                        left: 0,
                        right: 0,
                        zIndex: 3,
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        listStyle: 'none',
                        margin: 'auto'
                    }}
                >
                    {chipData.map(data => {

                        return (
                            <ListItem key={data.key}>
                                <Chip
                                    label={data.label}
                                    onDelete={handleDeleteChip(data.key)}
                                />
                            </ListItem>
                        )
                    })}
                </ul>
                <SubmitAlert alert={alert} error={error} errorText={errorText} />
                <FilterMenu />
                <Box sx={{
                    marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
                }}>

                    <TableContainer sx={{ height: '62.3vh' }} component={Paper}>
                        <Table sx={{ marginBottom: '0' }} aria-label="transactions list">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">Amount</StyledTableCell>
                                    <StyledTableCell align="center">Category</StyledTableCell>
                                    <StyledTableCell align="center">Subcategory</StyledTableCell>
                                    <StyledTableCell align="center">Account</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.slice(startIndex, endIndex).map(row => (
                                    <StyledTableRow style={{ backgroundColor: row.type == 'debit' ? '#ef5350' : '#4caf50' }} key={row.id} onClick={event => handleDetail(event, row.id)}>
                                        <StyledTableCell align="center">{row.type == 'debit' ? "-" : ""}{currencies.find(currency => currency.acronym == row.currencyAcronym).symbol}{row.amount}</StyledTableCell>
                                        <StyledTableCell align="center">{row.category}</StyledTableCell>
                                        <StyledTableCell align="center">{row.subcategory || "-"}</StyledTableCell>
                                        <StyledTableCell align="center">{row.account}</StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'
                    }}>
                        <Pagination sx={{ margin: 'auto 17.5rem auto auto' }} count={pageCount} color="primary" page={page} onChange={handlePagination} />
                        <TransactionsForm setSubmit={setSubmit} setAlert={setAlert} setError={setError} setErrorText={setErrorText} />
                    </Box>
                </Box>
            </Container>}
        </>
    )
}

export default TransactionsList