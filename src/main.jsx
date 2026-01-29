import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Environment Variable Validation
const requiredEnvs = ['VITE_API_BASE_URL'];
requiredEnvs.forEach(env => {
  if (!import.meta.env[env]) {
    console.warn(`🚨 [Agrimart Configuration Warning]: ${env} is not defined in your environment/ .env file.`);
    console.warn(`👉 Please check agrimart-frontend/.env.example for required setup.`);
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
