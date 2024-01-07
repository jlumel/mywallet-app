import { useState } from 'react'
import { Box, Button, Typography, Modal } from '@mui/material'

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

const ConfirmationModal = ({ isButtonDisabled, handleDelete }) => {

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Button
                variant="contained"
                color="error"
                className="createModifyButton"
                onClick={handleOpen}
                disabled={isButtonDisabled}
                sx={{ width: '40%' }}
            >
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
                        <Button color="error" onClick={handleDelete}>Yes</Button>
                        <Button variant="contained" onClick={handleClose}>No</Button>
                    </Box>
                </Box>
            </Modal>
        </>
    )
}

export default ConfirmationModal