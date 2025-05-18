import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const isLoggedIn = true;

  return isLoggedIn ? children : <Navigate to='/' />;
};

export default AdminRoute;
