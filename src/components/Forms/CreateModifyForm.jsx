import { useState, useEffect } from 'react'
import { useUserContext } from '../../context/userContext'
import { Container, FormControl, InputLabel, Select, MenuItem, Button, TextField, Box } from '@mui/material'
import { fetchAPI, updateData } from '../../utils'
import ConfirmationModal from '../Modal'
import SubmitAlert from '../SubmitAlert'

const CreateModifyForm = ({ action }) => {

  const setFormAction = action === 'create'

  const { token, currencies, accounts, categories, subcategories, setAccounts, setCategories, setSubcategories } = useUserContext()

  const [formData, setFormData] = useState({
    name: "",
    currencyAcronym: "",
    categoryName: ""
  }
  )

  const [walletItem, setWalletItem] = useState("")

  const [registry, setRegistry] = useState("")

  const [alert, setAlert] = useState(false)

  const [error, setError] = useState(false)

  const [errorText, setErrorText] = useState("")

  const isButtonDisabled =
    !walletItem || setFormAction && (
      (walletItem == 'account' && (!formData.name || !formData.currencyAcronym)) ||
      (walletItem == 'category' && (!formData.name)) ||
      (walletItem == 'subcategory' && (!formData.name || !formData.categoryName))) ||
    !setFormAction && (
      (walletItem == 'account' && (!formData.name && !formData.currencyAcronym)) ||
      (walletItem == 'category' && (!formData.name)) ||
      (walletItem == 'subcategory' && (!formData.name && !formData.categoryName))
    )

  const isDeleteButtonDisabled = !walletItem || !registry

  const parseWalletItem = walletItem => {

    switch (walletItem) {
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
      case 'account':
        return accounts

      case 'category':
        return categories

      case 'subcategory':

        return subcategories

      default:
        return []
    }
  }

  const handleChange = prop => event => {
    !setFormAction && walletItem == "subcategory" && setRegistry("")
    setFormData({ ...formData, [prop]: event.target.value ? event.target.value : "" })

  }

  const handleWalletItemChange = event => {
    setFormData({
      name: "",
      currencyAcronym: "",
      categoryName: ""
    })
    setWalletItem(event.target.value)
    setRegistry("")
  }

  const handleRegistryChange = event => {

    if (walletItem == "subcategory") {
      setFormData({
        ...formData,
        name: "",
      })
    } else {
      setFormData({
        name: "",
        currencyAcronym: "",
        categoryName: ""
      })
    }

    setRegistry(event.target.value)
  }

  const handleFormSubmit = event => {
    event.preventDefault()

    const parsedWalletItem = parseWalletItem(walletItem)

    switch (action) {
      case 'create':
        fetchAPI('post', `/api/${parsedWalletItem}`, formData, token)
          .then(res => {
            if (!res.data) {
              setErrorText(res.response.data.message)
              setError(true)
              setAlert(true)
              setTimeout(() => {
                setAlert(false)
              }, 3000)
            } else {
              setError(false)
              setErrorText("")
              setAlert(true)
              setTimeout(() => {
                setAlert(false)
                setErrorText("")
                setError(false)
              }, 3000)
            }
            setFormData(
              {
                ...formData,
                name: "",
                currencyAcronym: ""
              }
            )
          })
          .catch(err => {
            setError(true)
            setErrorText("Internal server error")
            setAlert(true)
            setTimeout(() => {
              setAlert(false)
            }, 3000)
            return err
          })
        break
      case 'modify':
        const selectedRegistry = parseRegistry(walletItem).find(item => item[walletItem == "currency" ? "acronym" : "name"] == registry)
        const id = selectedRegistry._id
        fetchAPI('put', `/api/${parsedWalletItem}/${id}`, formData, token)
          .then(res => {
            if (!res.data) {
              setErrorText(res.response.data.message)
              setError(true)
              setAlert(true)
              setTimeout(() => {
                setAlert(false)
              }, 3000)
            } else {
              setError(false)
              setErrorText("")
              setAlert(true)
              setTimeout(() => {
                setAlert(false)
              }, 3000)
            }
            setFormData(
              {
                ...formData,
                name: "",
                currencyAcronym: ""
              }
            )
            setRegistry("")
          })
          .catch(err => {
            setError(true)
            setErrorText("Internal server error")
            setAlert(true)
            setTimeout(() => {
              setAlert(false)
            }, 3000)
            return err
          })
    }
  }

  const handleDelete = event => {

    event.preventDefault()

    const parsedWalletItem = parseWalletItem(walletItem)

    const selectedRegistry = parseRegistry(walletItem).find(item => item.name == registry)
    const id = selectedRegistry._id
    fetchAPI('delete', `/api/${parsedWalletItem}/${id}?name=${registry}`, null, token)
      .then(res => {
        if (!res.data) {
          setErrorText(res.response.data.message)
          setError(true)
          setAlert(true)
          setTimeout(() => {
            setAlert(false)
          }, 3000)
        } else {
          setError(false)
          setErrorText("")
          setAlert(true)
          setTimeout(() => {
            setAlert(false)
          }, 3000)
        }
        setFormData({
          ...formData,
          name: "",
          acronym: "",
          symbol: ""
        })
        setRegistry("")
      })
      .catch(err => {
        setError(true)
        setErrorText("Internal server error")
        setAlert(true)
        setTimeout(() => {
          setAlert(false)
        }, 3000)
        return err
      })
  }

  useEffect(() => {

    updateData({ setAccounts, setCategories, setSubcategories }, token)
  }, [])

  return (

    <Container maxWidth="xs">
      <SubmitAlert alert={alert} error={error} errorText={errorText} />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',

        }}
      >
        <form style={{ width: '100%' }} onSubmit={handleFormSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="walletItem">Select a Wallet Item to {action}{!setFormAction ? " or delete" : ""}</InputLabel>
            <Select
              id="walletItem"
              value={walletItem}
              label={`Select a Wallet Item to ${action}${!setFormAction ? " or delete" : ""}`}
              onChange={handleWalletItemChange}
            >
              <MenuItem value="account">Account</MenuItem>
              <MenuItem value="category">Category</MenuItem>
              <MenuItem value="subcategory">Subcategory</MenuItem>
            </Select>
          </FormControl>

          {!setFormAction && walletItem && walletItem != "subcategory" && <FormControl fullWidth margin="normal">
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
                  <MenuItem key={item._id} value={item.name}>{item.name}</MenuItem>
                ) : <MenuItem selected value={`No ${parseWalletItem(walletItem)} found`}>No {parseWalletItem(walletItem)} found</MenuItem>
              }
            </Select>
          </FormControl>}

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

                    <MenuItem key={currency._id} value={currency.acronym}>{currency.acronym} - {currency.name}</MenuItem>
                  )) : <MenuItem selected value="No currencies found">No currencies found</MenuItem>}
                </Select>
              </FormControl>
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

              {!setFormAction && <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="registry">{parseRegistry("subcategory").find(item => item.categoryName === formData.categoryName)
                  ? "Select a subcategory to modify or delete"
                  : "No subcategories found"
                }</InputLabel>
                <Select
                  id="registry"
                  value={registry}
                  label={parseRegistry("subcategory").find(item => item.categoryName == formData.categoryName) ? "Select a subcategory to modify or delete" : "No subcategories found"}
                  onChange={handleRegistryChange}
                  disabled={!parseRegistry("subcategory").find(item => item.categoryName == formData.categoryName)}
                  required={true}
                >
                  {
                    parseRegistry("subcategory").find(item => item.categoryName == formData.categoryName) ? parseRegistry("subcategory").map(item =>
                      item.categoryName == formData.categoryName && <MenuItem key={item._id} value={item.name}>{item.name}</MenuItem>
                    ) : <MenuItem selected value={`No subcategories found`}>No subcategories found</MenuItem>
                  }
                </Select>
              </FormControl>}

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
          <Box sx={{ margin: '2rem auto', display: 'flex', justifyContent: 'space-around', width: '50%' }}>
            <Button
              className="createModifyButton"
              type="submit"
              variant="contained"
              color="primary"
              sx={{ width: '40%' }}
              disabled={isButtonDisabled}
            >
              {setFormAction ? 'Create' : 'Modify'}
            </Button>
            {!setFormAction && <ConfirmationModal isButtonDisabled={isDeleteButtonDisabled} handleDelete={handleDelete} />}

          </Box>
        </form>
      </Box>
    </Container>
  )
}

export default CreateModifyForm
