import { useState, useEffect } from 'react'
import { useUserContext } from '../../context/userContext'
import { Container, FormControl, InputLabel, Select, MenuItem, Button, TextField } from '@mui/material'
import { fetchAPI, updateData } from '../../utils'
import Loader from '../../components/Loader'
import './CreateModifyForm.css'

const CreateModifyForm = ({ action }) => {

  const setFormAction = action === 'create'

  const { currencies, accounts, categories, subcategories, setCurrencies, setAccounts, setCategories, setSubcategories } = useUserContext()

  const [formData, setFormData] = useState({
    name: "",
    acronym: "",
    currencyAcronym: "",
    categoryName: "",
    symbol: ""
  }
  )

  const [walletItem, setWalletItem] = useState("")

  const [loading, setLoading] = useState(false)

  const [submit, setSubmit] = useState(false)

  const [registry, setRegistry] = useState("")

  const isButtonDisabled =
    !walletItem || setFormAction && (
      (walletItem == 'currency' && (!formData.name || !formData.acronym || !formData.symbol)) ||
      (walletItem == 'account' && (!formData.name || !formData.currencyAcronym)) ||
      (walletItem == 'category' && (!formData.name)) ||
      (walletItem == 'subcategory' && (!formData.name || !formData.categoryName))) ||
    !setFormAction && (
      (walletItem == 'currency' && (!formData.name && !formData.acronym && !formData.symbol)) ||
      (walletItem == 'account' && (!formData.name && !formData.currencyAcronym)) ||
      (walletItem == 'category' && (!formData.name)) ||
      (walletItem == 'subcategory' && (!formData.name && !formData.categoryName))
    )

  const parseWalletItem = walletItem => {

    switch (walletItem) {
      case 'currency':
        return 'currencies'
      case 'account':
        return 'accounts'

      case 'category':
        return 'categories'

      case 'subcategory':

        return 'subcategories'
    }
  }

  const parseRegistry = walletItem => {

    switch (walletItem) {
      case 'currency':
        return currencies
      case 'account':
        return accounts

      case 'category':
        return categories

      case 'subcategory':

        return subcategories
    }
  }

  const handleChange = prop => event => {
    setFormData({ ...formData, [prop]: event.target.value })
  }

  const handleWalletItemChange = event => {
    setFormData({
      name: "",
      acronym: "",
      currencyAcronym: "",
      categoryName: "",
      symbol: ""
    })
    setWalletItem(event.target.value)
  }

  const handleRegistryChange = event => {
    setFormData({
      name: "",
      acronym: "",
      currencyAcronym: "",
      categoryName: "",
      symbol: ""
    })
    setRegistry(event.target.value)
  }

  const handleFormSubmit = event => {
    event.preventDefault()

    const parsedWalletItem = parseWalletItem(walletItem)

    switch (action) {
      case 'create':
        fetchAPI('post', `/api/${parsedWalletItem}`, formData)
          .then(res => setFormData({
            name: "",
            acronym: "",
            currencyAcronym: "",
            categoryName: "",
            symbol: ""
          }))
        setWalletItem("")
        setSubmit(true)
        break;
      case 'modify':
        const selectedRegistry = parseRegistry(walletItem).find(item => item[walletItem == "currency" ? "acronym" : "name"] == registry)
        const id = selectedRegistry._id
        fetchAPI('put', `/api/${parsedWalletItem}/${id}`, formData)
          .then(res => setFormData({
            name: "",
            acronym: "",
            currencyAcronym: "",
            categoryName: "",
            symbol: ""
          }))
        setWalletItem("")
        setSubmit(true)
    }
  }

  const handleDelete = event => {
    event.preventDefault()

    const parsedWalletItem = parseWalletItem(walletItem)

    const selectedRegistry = parseRegistry(walletItem).find(item => item[walletItem == "currency" ? "acronym" : "name"] == registry)
    const id = selectedRegistry._id
    fetchAPI('delete', `/api/${parsedWalletItem}/${id}`)
      .then(res => setFormData({
        name: "",
        acronym: "",
        currencyAcronym: "",
        categoryName: "",
        symbol: ""
      }))
    setWalletItem("")
    setSubmit(true)
  }

  useEffect(() => {

    setLoading(true)
    updateData(null, setAccounts, setCurrencies, setCategories, setSubcategories)
      .finally(() => {
        setLoading(false)
      })

  }, [submit])

  return (
    <>
      {loading ? <Loader /> : <Container>
        <form onSubmit={handleFormSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="walletItem">Select a Wallet Item to {action}{!setFormAction ? " or delete" : ""}</InputLabel>
            <Select
              id="walletItem"
              value={walletItem}
              label={`Select a Wallet Item to ${action}${!setFormAction ? " or delete" : ""}`}
              onChange={handleWalletItemChange}
            >
              <MenuItem value="currency">Currency</MenuItem>
              <MenuItem value="account">Account</MenuItem>
              <MenuItem value="category">Category</MenuItem>
              <MenuItem value="subcategory">Subcategory</MenuItem>
            </Select>
          </FormControl>

          {!setFormAction && walletItem ? <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="registry">{parseRegistry(walletItem).length ? `Select a${walletItem == 'account' ? "n" : ""} ${walletItem} to ${action}${!setFormAction ? " or delete" : ""}` : `No ${parseWalletItem(walletItem)} found`}</InputLabel>
            <Select
              id="registry"
              value={registry}
              label={parseRegistry(walletItem).length ? `Select a ${walletItem} to ${action}${!setFormAction ? " or delete" : ""}` : `No ${parseWalletItem(walletItem)} found`}
              onChange={handleRegistryChange}
              disabled={!parseRegistry(walletItem).length}
              required={true}
            >
              {
                parseRegistry(walletItem).length ? parseRegistry(walletItem).map(item =>
                  <MenuItem key={item._id} value={walletItem == 'currency' ? item.acronym : item.name}>{walletItem == 'currency' ? item.acronym : item.name}</MenuItem>
                ) : <MenuItem selected value={`No ${parseWalletItem(walletItem)} found`}>No {parseWalletItem(walletItem)} found</MenuItem>
              }
            </Select>
          </FormControl> : null}

          {walletItem === 'account' && (
            <>
              <TextField
                label="Name"
                value={formData.name}
                onChange={handleChange('name')}
                fullWidth
                margin="normal"
                required={setFormAction}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="currency">Currency</InputLabel>
                <Select
                  id="currency"
                  value={formData.currencyAcronym}
                  onChange={handleChange('currencyAcronym')}
                  label="Currency"
                  fullWidth
                  required={setFormAction}
                  disabled={currencies.length ? false : true}
                >
                  {currencies.length ? currencies.map(currency => (

                    <MenuItem key={currency._id} value={currency.acronym}>{currency.name}</MenuItem>
                  )) : <MenuItem selected value="No currencies found">No currencies found</MenuItem>}
                </Select>
              </FormControl>
            </>
          )}

          {walletItem === 'currency' && (
            <>
              <TextField
                label="Name"
                value={formData.name}
                onChange={handleChange('name')}
                fullWidth
                margin="normal"
                required={setFormAction}
              />
              <TextField
                label="Acronym"
                value={formData.acronym}
                onChange={handleChange('acronym')}
                fullWidth
                margin="normal"
                required={setFormAction}
              />
              <TextField
                label="Symbol"
                value={formData.symbol}
                onChange={handleChange('symbol')}
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
                onChange={handleChange('name')}
                fullWidth
                margin="normal"
                required={setFormAction}
              />
            </>
          )}

          {walletItem === 'subcategory' && (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="categoryName">Category Name</InputLabel>
                <Select
                  id="categoryName"
                  value={formData.categoryName}
                  onChange={handleChange('categoryName')}
                  label="Category Name"
                  fullWidth
                  required={setFormAction}
                  disabled={categories.length ? false : true}
                >
                  {categories.length ? categories.map(category => (

                    <MenuItem key={category._id} value={category.name}>{category.name}</MenuItem>
                  )) : <MenuItem selected value="No categories found">No categories found</MenuItem>}
                </Select>
              </FormControl>

              <TextField
                label="Name"
                value={formData.name}
                onChange={handleChange('name')}
                fullWidth
                margin="normal"
                required={setFormAction}
              />
            </>
          )}
          <div className="buttonContainer">
            <Button
              className="createModifyButton"
              type="submit"
              variant="contained"
              color="primary"
              disabled={isButtonDisabled}
            >
              {setFormAction ? 'Create' : 'Modify'}
            </Button>
            {!setFormAction && <Button
              className="createModifyButton"
              onClick={handleDelete}
              variant="contained"
              color="error"
              disabled={!walletItem || !registry ? true : false}
            >
              Delete
            </Button>}
          </div>
        </form>
      </Container>}
    </>
  )
}

export default CreateModifyForm
