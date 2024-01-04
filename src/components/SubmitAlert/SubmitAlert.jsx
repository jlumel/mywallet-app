import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'

const SubmitAlert = ({ error, errorText }) => {

    return (
        <Stack sx={{ position: 'absolute', top: 145, left: 0, right: 0, zIndex: 9999, margin: 'auto', alignItems: 'center', justifyContent: 'center', width: '50%' }}>
            {error ?
                <Alert variant="filled" severity="error">
                    {errorText || "An error has ocurred"}
                </Alert>
                :
                <Alert variant="filled" severity="success">
                    Success!
                </Alert>}
        </Stack>
    )
}


export default SubmitAlert