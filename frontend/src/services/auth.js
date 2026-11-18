
import { loginAdmin, getAdminMe } from './api'

export const login = async (username, password) => {
  return await loginAdmin(username, password)
}

export const getCurrentAdmin = async () => {
  return await getAdminMe()
}

export const logout = () => {
  localStorage.removeItem('portfolio_token')
  localStorage.removeItem('portfolio_admin')
}

export const isAuthenticated = () => {
  return Boolean(localStorage.getItem('portfolio_token'))
}
