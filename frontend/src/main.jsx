import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { LangProvider } from './lib/i18n'
import { PortfolioProvider } from './lib/portfolio'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LangProvider>
        <PortfolioProvider>
          <App />
        </PortfolioProvider>
      </LangProvider>
    </BrowserRouter>
  </React.StrictMode>
)
