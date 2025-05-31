import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../features/auth/AuthContext';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function checkAdminRole() {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Query the user_admin table to check for admin role
        // Thử cả id và email để đảm bảo
        const { data, error } = await supabase
          .from('user_admin')
          .select('*')
          .or(`id.eq.${user.id},email.eq.${user.email}`);

        if (error) {
          console.error('Error checking admin role:', error);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Check if user has admin role
        const hasAdminRole =
          data &&
          data.length > 0 &&
          data.some((record) => record.role === 'admin');

        setIsAdmin(hasAdminRole);
        setLoading(false);
      } catch (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
        setLoading(false);
      }
    }

    checkAdminRole();
  }, [user]);

  return { isAdmin, loading };
}
