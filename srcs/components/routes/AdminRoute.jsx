import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/components/services/supabase';
import Spinner from '../ui/Spinner';

// DEVELOPMENT MODE - Authentication Bypass
const BYPASS_AUTH = true; // Set to false to re-enable authentication

const AdminRoute = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (user) {
        const {
          data: { user: userData },
        } = await supabase.auth.getUser();
        setIsAdmin(userData?.user_metadata?.role === 'admin');
      }
      setLoading(false);
    };

    if (BYPASS_AUTH) {
      // Bypass authentication check in development mode
      setLoading(false);
    } else {
      checkAdminRole();
    }
  }, [user]);

  // Show loading state
  if (loading) {
    return <Spinner className='w-10 h-10' />;
  }

  // If bypassing auth, always render the outlet
  if (BYPASS_AUTH) {
    console.log("DEVELOPMENT MODE: Authentication bypassed for admin routes");
    return <Outlet />;
  }

  // Otherwise, check if user is admin
  if (!user || !isAdmin) {
    return <Navigate to='/login' replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
