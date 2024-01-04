import { Container, Box, Pagination, Table, TableBody, TableContainer, TableHead, TableRow, Paper } from "@mui/material"
import { styled } from '@mui/material/styles'
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import { useState, useEffect } from "react"
import { useUserContext } from '../../context/userContext'
import Loader from "../Loader"

const TransactionsList = () => {

    const { transactions } = useUserContext()

    const [loading, setLoading] = useState(false)

    const handleDetail = (event, id) => {
        console.log(id)
    }

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: '#45b39c',
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

    function createData(type, amount, category, subcategory, account, id) {
        return { type, amount, category, subcategory, account, id }
    }

    const rows = [
        createData('Debit', '-$159', 'Services', 'Edesur', 'Dollars', '12'),
        createData('Debit', '-$237', 'Services', 'Fibertel', 'Dollars', '85'),
        createData('Credit', '+$262', 'Salary', 'DH', 'Pesos', '6541'),
        createData('Debit', '-$305', 'Delivery', 'La Segunda', 'Pesos', '491'),
        createData('Debit', '-$356', 'Commute', 'Train', 'Dollars', '51341'),
        createData('Debit', '-$159', 'Services', 'Edesur', 'Dollars', '1'),
        createData('Debit', '-$237', 'Services', 'Fibertel', 'Dollars', '8'),
        createData('Credit', '+$262', 'Salary', 'DH', 'Pesos', '654'),
        createData('Debit', '-$305', 'Delivery', 'La Segunda', 'Pesos', '49'),
        createData('Debit', '-$356', 'Commute', 'Train', 'Dollars', '5134'),
    ]

    useEffect(() => {

        if (transactions.length) {

            setLoading(false)
        }

    }, [transactions])

    return (

        <>
            {loading ? <Loader /> : <Container>
                <Box sx={{
                    marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
                }}>

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center" >Type</StyledTableCell>
                                    <StyledTableCell align="center">Amount</StyledTableCell>
                                    <StyledTableCell align="center">Category</StyledTableCell>
                                    <StyledTableCell align="center">Subctaegory</StyledTableCell>
                                    <StyledTableCell align="center">Account</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <StyledTableRow key={row.id} onClick={event => handleDetail(event, row.id)}>
                                        <StyledTableCell align="center">{row.type}</StyledTableCell>
                                        <StyledTableCell align="center">{row.amount}</StyledTableCell>
                                        <StyledTableCell align="center">{row.category}</StyledTableCell>
                                        <StyledTableCell align="center">{row.subcategory}</StyledTableCell>
                                        <StyledTableCell align="center">{row.account}</StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Box sx={{
                    marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
                }}>
                    <Pagination count={10} color="primary" />
                </Box>

            </Container>}
        </>
    )
}

export default TransactionsList