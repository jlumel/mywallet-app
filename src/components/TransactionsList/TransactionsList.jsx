import { Container, Box, Pagination, Table, TableBody, TableContainer, TableHead, TableRow, Paper, Chip, Stack } from "@mui/material"
import { styled } from '@mui/material/styles'
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import { useState, useEffect } from "react"
import { useUserContext } from '../../context/userContext'
import Loader from "../Loader"
import { updateData, formatCurrency } from "../../utils"
import { TransactionsForm } from "../Forms"
import SubmitAlert from "../SubmitAlert"
import { useNavigate } from "react-router-dom"
import FilterMenu from "../FilterMenu/FilterMenu"

const StyledPagination = styled(Pagination)(({ theme }) => ({
    margin: 'auto 26rem auto auto',
    [theme.breakpoints.down('xl')]: {
        margin: 'auto 20rem auto auto'
    },
    [theme.breakpoints.down('md')]: {
        margin: 'auto'
    }
}))

const StyledContainer = styled(Container)(({ theme }) => ({
    [theme.breakpoints.down('xl')]: {
        width: '80%'
    },
    [theme.breakpoints.down('md')]: {
        width: '57%'
    }
}))

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    overflow: 'hidden',
    height: '69.4vh',
    [theme.breakpoints.down('xl')]: {
        height: '51vh'
    },
    [theme.breakpoints.down('md')]: {
        height: '46.5vh'
    }
}))

const TransactionsList = () => {

    const ROWS_PER_PAGE = window.innerWidth > 1400 ? 10 : 4

    const navigate = useNavigate()

    const { token, transactions, currencies, query, setTransactions, setAccounts, setCategories, setSubcategories, setQuery, setAccountFilter, setCurrencyFilter, setCategoryFilter, setMinDateFilter, setMaxDateFilter } = useUserContext()

    const [rows, setRows] = useState([])

    const [page, setPage] = useState(1)

    const [pageCount, setPageCount] = useState(0)

    const [chipData, setChipData] = useState([])

    const [loading, setLoading] = useState(false)

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

        key == 'currencyAcronym' && setCurrencyFilter({ active: false, param: { key: "currencyAcronym", value: "" } })

        key == 'categoryName' && setCategoryFilter({ active: false, param: { key: "categoryName", value: "" } })

        key == 'minDate' && setMinDateFilter({ active: false, param: { key: "minDate", value: "" } })

        key == 'maxDate' && setMaxDateFilter({ active: false, param: { key: "maxDate", value: "" } })

    }

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: '#78909c',
            color: theme.palette.common.white,
            [theme.breakpoints.down('md')]: {
                fontSize: '0.9rem',
            },
            [theme.breakpoints.down('lg')]: {
                fontSize: '1rem',
            },
            [theme.breakpoints.up('lg')]: {
                fontSize: '1.2rem',
            }
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: '1.1rem',
            [theme.breakpoints.down('md')]: {
                fontSize: '0.8rem',
            },
            [theme.breakpoints.down('lg')]: {
                fontSize: '0.9rem',
            },
            [theme.breakpoints.up('lg')]: {
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

    const createData = (id, type, currencyAcronym, amount, category, subcategory, account, timestamp) => ({ id, type, currencyAcronym, amount, category, subcategory, account, timestamp })

    const ListItem = styled('li')(({ theme }) => ({
        margin: theme.spacing(0.5),
    }))

    useEffect(() => {

        setLoading(true)
        updateData({ setTransactions, setAccounts, setCategories, setSubcategories }, token)
            .finally(() => {
                setLoading(false)
            })

    }, [])

    useEffect(() => {

        if (alert) {
            updateData({ setTransactions }, token)
        }

    }, [alert])

    useEffect(() => {
        if (Object.keys(query).length) {
            setChipData(query.map(item => ({ key: `${item.key}`, label: `${item.key}:${item.value}` })))

            let filteredTransactions = transactions.length
                ? transactions.filter(transaction =>
                    query.every(filter => {
                        const { key, value } = filter

                        const transactionDate = new Date(transaction.timestamp)

                        if (key === 'minDate') {
                            return transactionDate >= new Date(value)
                        }

                        if (key === 'maxDate') {
                            return transactionDate <= new Date(value)
                        }

                        return transaction[key] === value
                    })
                )
                : []

            setRows(filteredTransactions.map(transaction =>
                createData(
                    transaction._id,
                    transaction.type,
                    transaction.currencyAcronym,
                    transaction.amount,
                    transaction.categoryName,
                    transaction.subcategoryName,
                    transaction.accountName,
                    transaction.timestamp
                )
            ))
        } else {
            setChipData([])
            transactions.length && setRows(transactions.map(transaction =>
                createData(
                    transaction._id,
                    transaction.type,
                    transaction.currencyAcronym,
                    transaction.amount,
                    transaction.categoryName,
                    transaction.subcategoryName,
                    transaction.accountName,
                    transaction.timestamp
                )
            ))
        }
    }, [transactions, query])


    useEffect(() => {

        if (rows.length) {

            if (Math.floor(rows.length / ROWS_PER_PAGE) < rows.length / ROWS_PER_PAGE) {
                setPageCount(Math.floor(rows.length / ROWS_PER_PAGE) + 1)
            } else {
                setPageCount(Math.floor(rows.length / ROWS_PER_PAGE))
            }
        }

    }, [rows])

    const calculateSumsByCurrency = () => {
        const sums = {}
        rows.forEach(tx => {

            const sign = tx.type === 'debit' ? -1 : 1
            const amount = sign * tx.amount

            if (!sums[tx.currencyAcronym]) {
                sums[tx.currencyAcronym] = 0
            }

            sums[tx.currencyAcronym] += amount
        })
        return sums
    }

    const currencySums = calculateSumsByCurrency()

    return (
        <>
            {loading ? <Loader /> : <StyledContainer>
                <>
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
                        {chipData.map(data => (
                            <ListItem key={data.key}>
                                <Chip
                                    label={data.label}
                                    onDelete={handleDeleteChip(data.key)}
                                />
                            </ListItem>
                        ))}
                    </ul>

                    <SubmitAlert alert={alert} error={error} errorText={errorText} />
                    <FilterMenu />

                    <Box sx={{
                        marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
                    }}>
                        <StyledTableContainer component={Paper}>
                            <Table sx={{ marginBottom: '0' }} aria-label="transactions list">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="center">Date</StyledTableCell>
                                        <StyledTableCell align="center">Amount</StyledTableCell>
                                        <StyledTableCell align="center">Category</StyledTableCell>
                                        <StyledTableCell align="center">Subcategory</StyledTableCell>
                                        <StyledTableCell align="center">Account</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.slice(startIndex, endIndex).map(row => (
                                        <StyledTableRow style={{ backgroundColor: row.type == 'debit' ? '#ef5350' : '#4caf50' }} key={row.id} onClick={event => handleDetail(event, row.id)}>
                                            <StyledTableCell align="center">{new Date(row.timestamp).toLocaleDateString()}</StyledTableCell>
                                            <StyledTableCell align="center">{row.type == 'debit' ? "-" : ""}{formatCurrency(row.amount, row.currencyAcronym)}</StyledTableCell>
                                            <StyledTableCell align="center">{row.category}</StyledTableCell>
                                            <StyledTableCell align="center">{row.subcategory || "-"}</StyledTableCell>
                                            <StyledTableCell align="center">{row.account}</StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </StyledTableContainer>

                        <Box sx={{ mt: 2 }}>
                            <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                                {Object.entries(currencySums).map(([currency, sum]) => {
                                    const symbol = currencies?.find(c => c.acronym === currency)?.symbol || ''
                                    const color = sum < 0 ? 'error' : 'success'
                                    return (
                                        <Chip
                                            key={currency}
                                            label={`${formatCurrency(sum, currency)}`}
                                            color={color}
                                            variant="outlined"
                                            sx={{ fontSize: '1rem' }}
                                        />
                                    )
                                })}
                            </Stack>
                        </Box>


                        <Box sx={{
                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'
                        }}>
                            <StyledPagination count={pageCount} color="primary" page={page} onChange={handlePagination} />
                            <TransactionsForm setAlert={setAlert} setError={setError} setErrorText={setErrorText} />
                        </Box>
                    </Box>
                </>
            </StyledContainer>}
        </>
    )

}

export default TransactionsList