import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getPortfolio } from './api'

const PortfolioContext = createContext(null)

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(
    () =>
      getPortfolio()
        .then(d => {
          setData(d)
          setError(null)
        })
        .catch(err => {
          console.error('Gagal mengambil portfolio:', err)
          setError(err)
        })
        .finally(() => setLoading(false)),
    []
  )

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const load = useCallback(() => {
    setLoading(true)
    fetchData()
  }, [fetchData])

  return (
    <PortfolioContext.Provider value={{ data, error, loading, reload: load }}>
      {children}
    </PortfolioContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePortfolio() {
  const ctx = useContext(PortfolioContext)
  const d = ctx.data || {}
  return {
    ...ctx,
    profile: d.profile || {},
    projects: d.projects || [],
    skills: d.skills || [],
    experience: d.experience || [],
    education: d.education || [],
    certificates: d.certificates || [],
    articles: d.articles || []
  }
}
