import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'

const SubmitAlert = ({ error, errorText }) => {

    return (
        <Stack sx={{ margin: 'auto', alignItems: 'center', justifyContent: 'center', width: '50%' }} spacing={2}>
            {error ?
                <Alert variant="filled" severity="error">
                    {errorText}
                </Alert>
                :
                <Alert variant="filled" severity="success">
                    Success!
                </Alert>}
        </Stack>
    )
}


export default SubmitAlert