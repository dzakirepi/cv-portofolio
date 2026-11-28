import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
})

export const getPortfolio = () => api.get('/portfolio').then(r => r.data.data)

export const getArticle = slug => api.get(`/articles/${encodeURIComponent(slug)}`).then(r => r.data.data)

export const sendContactMessage = payload => api.post('/contact', payload).then(r => r.data)

export default api
