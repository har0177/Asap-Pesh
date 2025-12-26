import { atom, selector } from 'recoil'

// Theme Atom
export const ThemeAtom = atom({
  key: 'themeAtom',
  default: localStorage.getItem('theme') || 'light',
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        localStorage.setItem('theme', newValue)
      })
    },
  ],
})

export const isDarkModeSelector = selector({
  key: 'isDarkModeSelector',
  get: ({ get }) => get(ThemeAtom) === 'dark',
})

// User and Permissions
export const userAtom = atom({
  key: 'userAtom',
  default: {},
})

export const permissionsAtom = atom({
  key: 'permissionsState',
  default: [],
})

// Data Table State
export const DataTableAtom = atom({
  key: 'dataTableAtom',
  default: {},
})

// Notice Bar
export const noticeBarState = atom({
  key: 'noticeBarState',
  default: {
    is_visible: false,
    notice_text: '',
    background_color: '#facc15',
    text_color: '#000000',
  },
})

// Filter State
export const filterAtom = atom({
  key: 'filter',
  default: {},
})

export const showFilterResetAtom = atom({
  key: 'showResetFilter',
  default: false,
})

// Menu State
const getInitialMenuKeys = (key, defaultValue) => {
  if (typeof window === 'undefined') return defaultValue
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : defaultValue
  } catch {
    return defaultValue
  }
}

export const menuOpenKeysAtom = atom({
  key: 'menuOpenKeysAtom',
  default: getInitialMenuKeys('openMenuKeys', ['dashboard']),
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        try {
          localStorage.setItem('openMenuKeys', JSON.stringify(newValue))
        } catch (error) {
          console.error('Failed to save openMenuKeys:', error)
        }
      })
    },
  ],
})

export const menuSelectedKeysAtom = atom({
  key: 'menuSelectedKeysAtom',
  default: getInitialMenuKeys('selectedMenuKeys', ['/dashboard']),
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        try {
          localStorage.setItem('selectedMenuKeys', JSON.stringify(newValue))
        } catch (error) {
          console.error('Failed to save selectedMenuKeys:', error)
        }
      })
    },
  ],
})

// Record Atoms for CRUD
export const userRecordAtom = atom({
  key: 'userRecordAtom',
  default: null,
})

export const studentRecordAtom = atom({
  key: 'studentRecordAtom',
  default: null,
})

export const projectRecordAtom = atom({
  key: 'projectRecordAtom',
  default: null,
})

export const applicationRecordAtom = atom({
  key: 'applicationRecordAtom',
  default: null,
})
