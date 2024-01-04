import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import RemoveIcon from '@mui/icons-material/Remove'

const TransactionsButtons = () => {

    return (
        <Box sx={{ '& > :not(style)': { m: 1 }, display: 'flex', justifyContent: 'flex-end', mt: '1rem' }}>
            <Fab color="success" aria-label="add">
                <AddIcon />
            </Fab>
            <Fab color="primary" aria-label="edit">
                <EditIcon />
            </Fab>
            <Fab color="error" aria-label="remove">
                <RemoveIcon />
            </Fab>
        </Box>
    )

}

export default TransactionsButtons