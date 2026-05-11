import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="329419189438-uogk8402pcar2d8ic4hj9rlp78gjn1m6.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
)