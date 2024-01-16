import { Switch, Box, Typography, FormControlLabel, FormGroup, Select, MenuItem } from "@mui/material"
import styled from "@emotion/styled"
import { useEffect } from "react"
import { useUserContext } from "../../context/userContext"

const FilterMenu = () => {

    const { accounts, currencies, categories, accountFilter, currencyFilter, categoryFilter, setQuery, setAccountFilter, setCurrencyFilter, setCategoryFilter } = useUserContext()

    const StyledBox = styled(Box)(({ theme }) => ({
        position: 'absolute',
        right: '0%',
        marginTop: 60,
        width: '15%',
        [theme.breakpoints.down('xl')]: {
            width: '14%'
        },
        [theme.breakpoints.down('md')]: {
            width: '24%'
        }
    }))

    const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
        [theme.breakpoints.down('md')]: {
            display: 'flex',
            flexDirection: 'column'
        }
    }))

    const StyledSelect = styled(Select)(({ theme }) => ({
        height: '1.5rem',
        width: '7.5rem',
        [theme.breakpoints.down('md')]: {
            height: '1.3rem',
            width: '5rem'
        }
    }))

    const handleToggleFilter = filterType => {

        switch (filterType) {

            case "account":

                if (accountFilter.active) {
                    setAccountFilter({ active: false, param: { key: "accountName", value: "" } })
                } else {
                    setAccountFilter(prevFilter => ({ ...prevFilter, active: true }))
                }
                break
            case "currency":
                if (currencyFilter.active) {
                    setCurrencyFilter({ active: false, param: { key: "currencyAcronym", value: "" } })
                } else {
                    setCurrencyFilter(prevFilter => ({ ...prevFilter, active: true }))
                }
                break
            case "category":
                if (categoryFilter.active) {
                    setCategoryFilter({ active: false, param: { key: "categoryName", value: "" } })
                } else {
                    setCategoryFilter(prevFilter => ({ ...prevFilter, active: true }))
                }
                break
        }
    }

    const handleFilterValueChange = filterType => event => {

        const newValue = event.target.value

        switch (filterType) {
            case "account":
                setAccountFilter(prevFilter => ({ ...prevFilter, param: { key: "accountName", value: newValue } }))
                break
            case "currency":
                setCurrencyFilter(prevFilter => ({ ...prevFilter, param: { key: "currencyAcronym", value: newValue } }))
                break
            case "category":
                setCategoryFilter(prevFilter => ({ ...prevFilter, param: { key: "categoryName", value: newValue } }))
                break
        }
    }

    useEffect(() => {

        const filters = [accountFilter, categoryFilter, currencyFilter]

        const params = []

        filters.forEach(filter => {
            if (filter.param.value) {
                params.push(filter.param)
            }
        })

        params.length ? setQuery(params) : setQuery([])

    }, [accountFilter, categoryFilter, currencyFilter])

    return (
        <StyledBox>
            <Typography sx={{ fontSize: '1.5rem' }} variant="h6">Filters</Typography>

            <FormGroup>

                <Box sx={{ display: 'flex', flexDirection: 'column' }} mt={2}>
                    <StyledFormControlLabel control={<Switch checked={accountFilter.active} onClick={() => handleToggleFilter("account")} />} label="Account" />
                    <StyledSelect
                        sx={{ height: '1.5rem', width: '7.5rem' }}
                        value={accountFilter.param.value}
                        onChange={handleFilterValueChange('account')}
                        label="Account"
                        disabled={!accountFilter.active}
                    >
                        {accounts.length ? accounts.map(account => (

                            <MenuItem key={account._id} value={account.name}>{account.name}</MenuItem>
                        )) : <MenuItem selected value="No accounts found">No accounts found</MenuItem>}
                    </StyledSelect>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }} mt={2}>
                    <StyledFormControlLabel control={<Switch checked={currencyFilter.active} onClick={() => handleToggleFilter("currency")} />} label="Currency" />
                    <StyledSelect
                        sx={{ height: '1.5rem', width: '7.5rem' }}
                        value={currencyFilter.param.value}
                        onChange={handleFilterValueChange('currency')}
                        label="Currency"
                        disabled={!currencyFilter.active}
                    >
                        {currencies.length ? currencies.map(currency => (

                            <MenuItem key={currency._id} value={currency.acronym}>{currency.acronym}</MenuItem>
                        )) : <MenuItem selected value="No currencies found">No currencies found</MenuItem>}
                    </StyledSelect>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }} mt={2}>
                    <StyledFormControlLabel control={<Switch checked={categoryFilter.active} onClick={() => handleToggleFilter("category")} />} label="Category" />
                    <StyledSelect
                        sx={{ height: '1.5rem', width: '7.5rem' }}
                        value={categoryFilter.param.value}
                        onChange={handleFilterValueChange('category')}
                        label="Category"
                        disabled={!categoryFilter.active}
                    >
                        {categories.length ? categories.map(category => (

                            <MenuItem key={category._id} value={category.name}>{category.name}</MenuItem>
                        )) : <MenuItem selected value="No categories found">No categories found</MenuItem>}
                    </StyledSelect>
                </Box>
            </FormGroup>
        </StyledBox>
    )

}

export default FilterMenu