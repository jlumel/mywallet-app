import { Typography, Container, Box, styled } from "@mui/material"

const ResponsiveTypography = styled(Typography)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        fontSize: '1.5rem',
    },
    [theme.breakpoints.up('sm')]: {
        fontSize: '2rem',
    },
}))

const PageTitle = ({ text }) => {
    return (
        <Container>
            <Box sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
            }}>
                <ResponsiveTypography marginTop="2rem" variant="h4">{text}</ResponsiveTypography>
            </Box>
        </Container>
    )
}

export default PageTitle