import './styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserProvider } from './components/features/user/UserContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
