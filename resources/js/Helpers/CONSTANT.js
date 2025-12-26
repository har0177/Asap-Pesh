import { message, notification } from 'antd'

// API Response Handlers
export const handleApiError = (error) => {
  const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred'

  if (error?.response?.status === 422) {
    // Validation errors
    const errors = error?.response?.data?.errors
    if (errors) {
      Object.values(errors).forEach((errorArray) => {
        if (Array.isArray(errorArray)) {
          errorArray.forEach((err) => message.error(err))
        }
      })
    } else {
      message.error(errorMessage)
    }
  } else if (error?.response?.status === 403) {
    message.error('You do not have permission to perform this action')
  } else if (error?.response?.status === 404) {
    message.error('Resource not found')
  } else if (error?.response?.status === 401) {
    message.error('Session expired. Please login again.')
    window.location.href = '/login'
  } else {
    message.error(errorMessage)
  }
}

export const handleApiSuccess = (response, customMessage = null) => {
  const successMessage = customMessage || response?.data?.message || 'Operation successful'
  message.success(successMessage)
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
