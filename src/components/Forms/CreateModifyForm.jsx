import { useState, useEffect } from 'react'
import { useUserContext } from '../../context/userContext'
import { Container, FormControl, InputLabel, Select, MenuItem, Button, TextField } from '@mui/material'
import { fetchAPI, updateData } from '../../utils'
import Loader from '../../components/Loader'

const CreateModifyForm = ({ action }) => {

  const setFormAction = action === 'create'

  const { currencies, accounts, categories, subcategories, setCurrencies, setAccounts, setCategories, setSubcategories } = useUserContext()

  const [formData, setFormData] = useState({
    name: "",
    acronym: "",
    symbol: ""
  }
  )

  const [walletItem, setWalletItem] = useState("")

  const [loading, setLoading] = useState(false)

  const isButtonDisabled =
    (setFormAction && (!formData.name || !formData.acronym || !formData.symbol)) ||
    (!setFormAction && !formData.name)

  const handleChange = prop => event => {
    setFormData({ ...formData, [prop]: event.currentTarget.value })
  }

  const handleFormSubmit = event => {
    event.preventDefault()
    

  }

  useEffect(() => {

    setLoading(true)
    updateData(null, setAccounts, setCurrencies, setCategories, setSubcategories)
      .finally(() => {
        setLoading(false)
      })

  }, [])

  return (
    <>
      {loading ? <Loader /> : <Container>
        <form onSubmit={handleFormSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="walletItem">Select a Wallet Item to {action}</InputLabel>
            <Select
              id="walletItem"
              value={walletItem}
              label={"Select a Wallet Item to " + action}
              onChange={handleChange}
            >
              <MenuItem value="currency">Currency</MenuItem>
              <MenuItem value="account">Account</MenuItem>
              <MenuItem value="category">Category</MenuItem>
              <MenuItem value="subcategory">Subcategory</MenuItem>
            </Select>
          </FormControl>

          {walletItem === 'account' && (
            <>
              <TextField
                label="Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required={setFormAction}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="currency">Currency</InputLabel>
                <Select
                  id="currency"
                  value={formData.acronym}
                  onChange={handleChange}
                  label="Currency"
                  fullWidth
                  required={setFormAction}
                  disabled={currencies.length ? false : true}
                >
                  {currencies.length ? currencies.map(currency => (

                    <MenuItem value={currency}>{currency}</MenuItem>
                  )) : <MenuItem selected value={"No currencies found"}>No currencies found</MenuItem>}
                </Select>
              </FormControl>
            </>
          )}

          {walletItem === 'currency' && (
            <>
              <TextField
                label="Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required={setFormAction}
              />
              <TextField
                label="Acronym"
                value={formData.acronym}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required={setFormAction}
              />
              <TextField
                label="Symbol"
                value={formData.symbol}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required={setFormAction}
              />
            </>
          )}

          {walletItem === 'category' && (
            <>
              <TextField
                label="Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required={setFormAction}
              />
            </>
          )}

          {walletItem === 'subcategory' && (
            <>
              <TextField
                label="Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required={setFormAction}
              />
            </>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isButtonDisabled}
          >
            {setFormAction ? 'Create' : 'Modify'}
          </Button>
        </form>
      </Container>}
    </>
  )
}

export default CreateModifyForm
