import axios from 'axios'
import { debounce } from 'lodash'

const fetchOptions = (type, search, params = {}) => {
  return axios.post(route('admin.dropdown', { type }), { q: search, ...params })
}

const debouncedFetchOptions = debounce((type, search, params, callback) => {
  fetchOptions(type, search, params).then(callback).catch(error => console.error(error))
}, 300)

export { fetchOptions, debouncedFetchOptions }
