import { CircularProgress, Box } from '@mui/material'

const Loader = () => {

    return (

        <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', height: '90vh', flexDirection: 'column'
        }}>
            <h2>Loading</h2>
            <CircularProgress />
        </Box >

    )
}

export default Loader