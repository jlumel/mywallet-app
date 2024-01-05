import { useState } from 'react'
import { Box, Button, Typography, Modal } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '25rem',
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
}

const ConfirmationModal = ({ walletItem, registry, handleDelete, submitLoading }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div className="buttonContainer">
            <Button
                variant="contained"
                color="error"
                disabled={!walletItem || !registry ? true : false}
                className="createModifyButton" onClick={handleOpen}>
                Delete
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography color="red" id="modal-modal-title" variant="h5" component="h2">
                        Warning! This action can't be undone
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 4, mb: 3 }}>
                        Are you sure you want to delete this registry?
                    </Typography>
                    <Box>
                    {!submitLoading && <Button color="error" onClick={handleDelete}>Yes</Button>}
                        {submitLoading && <LoadingButton loading>Loading</LoadingButton>}
                        <Button variant="contained" onClick={handleClose}>No</Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}

export default ConfirmationModal