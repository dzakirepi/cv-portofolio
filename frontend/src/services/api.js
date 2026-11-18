
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('portfolio_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const getPortfolio = async () => {
  const response = await api.get('/portfolio')
  return response.data
}

export const getPublicCollection = async (collection) => {
  const response = await api.get(`/public/${collection}`)
  return response.data
}

export const loginAdmin = async (username, password) => {
  const response = await api.post('/auth/login', {
    username,
    password
  })

  const result = response.data

  if (result.success && result.data?.token) {
    localStorage.setItem('portfolio_token', result.data.token)
    localStorage.setItem(
      'portfolio_admin',
      JSON.stringify(result.data.admin)
    )
  }

  return result
}

export const getAdminMe = async () => {
  const response = await api.get('/admin/me')
  return response.data
}

export const getAdminList = async (collection) => {
  const response = await api.get(`/admin/${collection}`)
  return response.data
}

export const createContent = async (collection, payload) => {
  const response = await api.post(`/admin/${collection}`, payload)
  return response.data
}

export const updateContent = async (collection, id, payload) => {
  const response = await api.put(
    `/admin/${collection}/${id}`,
    payload
  )
  return response.data
}

export const deleteContent = async (collection, id) => {
  const response = await api.delete(
    `/admin/${collection}/${id}`
  )
  return response.data
}

export const sendContactMessage = async (payload) => {
  const response = await api.post('/contact', payload)
  return response.data
}

export default api
