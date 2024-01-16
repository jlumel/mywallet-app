import { CircularProgress, Box, Typography } from '@mui/material'

const Loader = () => {

    return (

        <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column'
        }}>
            <Typography variant="h5">Loading</Typography>
            <CircularProgress />
        </Box >

    )
}

export default Loader