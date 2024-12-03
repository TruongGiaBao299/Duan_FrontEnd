import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthWarrper } from './context/auth.context.jsx'
import { ToastContainer, toast } from "react-toastify";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthWarrper>
      <App />
    </AuthWarrper>

    <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ToastContainer />
  </StrictMode>,
)
