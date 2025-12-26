import { message, notification } from 'antd'

// API Response Handlers - SparkCRM Style
export const handleApiError = (error) => {
  if (!error || !error.response || !error.response.data) {
    if (error?.errorFields) {
      // Form validation errors
      error.errorFields.forEach(({ name, errors }) => {
        message.error(errors.join(', '))
      })
    } else {
      message.error(error?.message || 'An error occurred')
    }
    return
  }

  const { errors, message: errorMessage } = error.response.data
  const status = error.response.status

  // Handle specific status codes
  if (status === 401) {
    message.error('Session expired. Please login again.')
    setTimeout(() => {
      window.location.href = '/login'
    }, 1000)
    return
  }

  if (status === 403) {
    message.error('You do not have permission to perform this action')
    return
  }

  if (status === 404) {
    message.error('Resource not found')
    return
  }

  // Handle validation errors (422)
  if (errors && typeof errors === 'object') {
    Object.keys(errors).forEach(field => {
      const fieldErrors = errors[field]
      if (Array.isArray(fieldErrors)) {
        fieldErrors.forEach(err => message.error(err))
      } else {
        message.error(`${fieldErrors}`)
      }
    })
  } else if (errorMessage) {
    message.error(errorMessage)
  } else {
    message.error('An error occurred')
  }
}

export const handleApiSuccess = (response, customMessage = null) => {
  if (!response || !response.data) {
    if (customMessage) {
      message.success(customMessage)
    }
    return
  }

  const { notifications, message: successMessage } = response.data

  // Handle notifications array (SparkCRM style)
  if (notifications && notifications.length > 0) {
    notifications
      .filter(notification => notification.type === 'success' && notification.message)
      .forEach(notification => {
        message.success(notification.message)
      })

    notifications
      .filter(notification => notification.type === 'error' && notification.message)
      .forEach(notification => {
        message.error(notification.message)
      })

    notifications
      .filter(notification => notification.type === 'warning' && notification.message)
      .forEach(notification => {
        message.warning(notification.message)
      })

    notifications
      .filter(notification => notification.type === 'info' && notification.message)
      .forEach(notification => {
        message.info(notification.message)
      })
  } else if (customMessage) {
    message.success(customMessage)
  } else if (successMessage) {
    message.success(successMessage)
  }
}

// Utility functions
export const isEmpty = (value) => {
  if (value == null) return true
  if (typeof value === 'number' && value === 0) return true
  if (typeof value === 'string' || Array.isArray(value)) return value.length === 0
  if (typeof value.size === 'number') return value.size === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const formatCurrency = (number, fractionDigits = 0, prefix = 'Rs.') => {
  if (number === undefined || number === null || isNaN(number)) {
    number = 0
  }
  const formattedNumber = Number(number).toFixed(fractionDigits)
  const [integerPart, decimalPart] = formattedNumber.split('.')
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return prefix + ' ' + formattedInteger + (decimalPart ? '.' + decimalPart : '')
}

export const formatPhoneNumber = (number) => {
  if (isEmpty(number)) return ''
  const digits = number.toString().replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('0')) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`
  }
  return digits
}

export const onlyNumbers = (value) => /^\d*$/.test(value)

export const filterNumber = (string) => {
  if (isEmpty(string)) return 0
  string = string.toString().replace(/[^\d.]+/g, '')
  if (isEmpty(string)) return string
  return parseFloat(string)
}

export const getInitials = (name) => {
  if (!name || typeof name !== 'string') return '?'
  const nameParts = name.trim().split(' ')
  const firstInitial = nameParts[0]?.[0] || ''
  const secondInitial = nameParts[1]?.[0] || ''
  return `${firstInitial}${secondInitial}`.toUpperCase()
}

export const stringToColor = (str) => {
  if (!str) return '#1890ff'
  const colors = [
    '#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#87d068',
    '#1890ff', '#722ed1', '#eb2f96', '#13c2c2', '#fa541c',
  ]
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

// Hex to RGBA converter
export function hexToRgba(input, alpha = 1) {
  if (input == null) return `rgba(0,0,0,${alpha})`

  let v = typeof input === 'string' ? input.trim() : String(input)

  // Already a color format we shouldn't transform
  if (
    v.startsWith('rgba(') ||
    v.startsWith('rgb(') ||
    v.startsWith('hsl(') ||
    v.startsWith('var(')
  ) {
    return v
  }

  // Normalize hex
  let hex = v.replace(/^#/, '')
  if (![3, 4, 6, 8].includes(hex.length)) {
    return v
  }

  if (hex.length === 3 || hex.length === 4) {
    hex = hex.split('').map(c => c + c).join('')
  }

  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)

  if (![r, g, b].every(Number.isFinite)) {
    return `rgba(0,0,0,${alpha})`
  }

  let a = alpha
  if (hex.length === 8) {
    const ah = parseInt(hex.slice(6, 8), 16)
    const fromHex = Number.isFinite(ah) ? +(ah / 255).toFixed(3) : 1
    a = alpha ?? fromHex
  }

  return `rgba(${r}, ${g}, ${b}, ${a})`
}

// Modal Title Style
export const MODAL_TITLE_STYLE = (token) => ({
  padding: '16px 24px',
  borderBottom: `1px solid ${token.colorBorderSecondary}`,
  margin: '-20px -24px 24px -24px',
})

// Status Colors
export const STATUS_COLORS = {
  active: 'green',
  inactive: 'red',
  pending: 'orange',
  approved: 'green',
  rejected: 'red',
  completed: 'blue',
  draft: 'default',
}

// Common filter field definitions for DataGridTable
export const USER_FILTER_FIELDS = {
  TEXTS: {
    name: { name: 'name', label: 'Name' },
    email: { name: 'email', label: 'Email' },
  },
  SELECTS: {
    role_id: { name: 'role_id', label: 'Role', type: 'roles' },
    status: {
      name: 'status',
      label: 'Status',
      type: 'static',
      params: {
        options: [
          { value: 1, label: 'Active' },
          { value: 0, label: 'Inactive' },
        ]
      }
    },
  },
  DATES: {
    created_at: { name: 'created_at', label: 'Created At' },
  },
}

export const STUDENT_FILTER_FIELDS = {
  TEXTS: {
    name: { name: 'name', label: 'Name' },
    cnic: { name: 'cnic', label: 'CNIC' },
    phone: { name: 'phone', label: 'Phone' },
  },
  SELECTS: {
    diploma_id: { name: 'diploma_id', label: 'Diploma', type: 'diplomas' },
    batch_id: { name: 'batch_id', label: 'Batch', type: 'batches' },
    session_id: { name: 'session_id', label: 'Session', type: 'sessions' },
    status: {
      name: 'status',
      label: 'Status',
      type: 'static',
      params: {
        options: [
          { value: 'active', label: 'Active' },
          { value: 'graduated', label: 'Graduated' },
          { value: 'dropped', label: 'Dropped' },
        ]
      }
    },
  },
  DATES: {
    created_at: { name: 'created_at', label: 'Created At' },
  },
}

export const PROJECT_FILTER_FIELDS = {
  TEXTS: {
    title: { name: 'title', label: 'Title' },
    description: { name: 'description', label: 'Description' },
  },
  SELECTS: {
    status: {
      name: 'status',
      label: 'Status',
      type: 'static',
      params: {
        options: [
          { value: 'open', label: 'Open' },
          { value: 'closed', label: 'Closed' },
          { value: 'archived', label: 'Archived' },
        ]
      }
    },
  },
  DATES: {
    start_date: { name: 'start_date', label: 'Start Date' },
    end_date: { name: 'end_date', label: 'End Date' },
    created_at: { name: 'created_at', label: 'Created At' },
  },
}

export const APPLICATION_FILTER_FIELDS = {
  TEXTS: {
    applicant_name: { name: 'applicant_name', label: 'Applicant Name' },
  },
  SELECTS: {
    project_id: { name: 'project_id', label: 'Project', type: 'projects' },
    status: {
      name: 'status',
      label: 'Status',
      type: 'static',
      params: {
        options: [
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Approved' },
          { value: 'rejected', label: 'Rejected' },
        ]
      }
    },
  },
  DATES: {
    created_at: { name: 'created_at', label: 'Applied At' },
  },
}
