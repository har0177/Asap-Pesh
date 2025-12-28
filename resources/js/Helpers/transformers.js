import dayjs from 'dayjs'

export const dataToOptions = (data) => {
  if (data === undefined || data === null) {
    return []
  }
  // Handle axios response - data.data contains the API response {success, data: [...]}
  const items = data?.data?.data || data?.data || []
  if (!Array.isArray(items)) {
    return []
  }
  return items.map((item) => {
    return {
      label: String(item.label || item.name || ''),
      value: item.id,
      item: item,
      color: item?.color,
    }
  })
}

export const parseMetaIds = (meta) => {
  if (!meta) return []
  return Array.isArray(meta)
    ? meta.map(id => String(id).trim())
    : String(meta).split(',').map(id => id.trim())
}

export const validateMaskedNumber = (_, value) => {
  if (!value || value.includes('_')) {
    return Promise.reject(new Error('Please enter a valid number.'))
  }
  return Promise.resolve()
}

export const formatDates = (values, dateFields) => {
  dateFields.forEach(field => {
    if (values[field]) {
      values[field] = dayjs(values[field]).format('YYYY-MM-DD')
    } else {
      delete values[field]
    }
  })
}

export const formatDate = (date, format = 'DD-MM-YYYY') => {
  return date ? dayjs(date).format(format) : null
}

export const isHardEmpty = (obj) => {
  if (!obj || Object.keys(obj).length === 0) {
    return true
  }
  return Object.values(obj).every(value => value === null)
}

export const mapToSelectOption = (id, name, fallback = '') => {
  if (!id) return null
  return {
    value: id,
    label: name || fallback,
  }
}

export const formatSelectValues = (values) => {
  Object.keys(values).forEach((key) => {
    if ((key.endsWith('_id') || key.match(/_id_\d+$/)) && values[key]?.value) {
      values[key] = values[key].value
    }
    if (Array.isArray(values[key]) && values[key].length > 0 && values[key][0]?.value !== undefined) {
      values[key] = values[key].map(item => item.value)
    }
  })
  return values
}

// hexToRgba is now exported from CONSTANT.js - import from there
// Re-export for backwards compatibility
export { hexToRgba } from './CONSTANT.js'

export const validatePasswordConfirmation = ({ getFieldValue }) => ({
  validator(_, value) {
    if (!value || getFieldValue('password') === value) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('The passwords do not match!'))
  },
})

export const toTitleCase = (str) => {
  if (!str) return ''
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
