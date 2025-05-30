import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/components/services/supabase';
import Spinner from '../ui/Spinner';

// DEVELOPMENT MODE - Authentication Bypass
const BYPASS_AUTH = false; // Tắt bypass để kiểm tra thực quyền

const AdminRoute = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (user) {
        try {
          // Lấy user id
          const userId = user.id || user?.user?.id;
          if (userId) {
            try {
              // First, check the user_admin table structure
              const { data: sampleData, error: sampleError } = await supabase
                .from('user_admin')
                .select('*')
                .limit(1);

              if (sampleError) {
                console.error('Error checking user_admin table:', sampleError);
                setIsAdmin(false);
                setLoading(false);
                return;
              }

              // Determine the correct column name for user ID
              let userIdColumn = 'user_id';

              if (sampleData && sampleData.length > 0) {
                const firstRecord = sampleData[0];
                // Check if userId (camelCase) exists instead of user_id (snake_case)
                if (
                  Object.prototype.hasOwnProperty.call(firstRecord, 'userId') &&
                  !Object.prototype.hasOwnProperty.call(firstRecord, 'user_id')
                ) {
                  userIdColumn = 'userId';
                  console.log("Using 'userId' column instead of 'user_id'");
                }
                // Check if userid (lowercase) exists
                else if (
                  Object.prototype.hasOwnProperty.call(firstRecord, 'userid') &&
                  !Object.prototype.hasOwnProperty.call(firstRecord, 'user_id')
                ) {
                  userIdColumn = 'userid';
                  console.log("Using 'userid' column instead of 'user_id'");
                }
              }

              // Truy vấn bảng user_admin để kiểm tra quyền admin
              const { data, error } = await supabase
                .from('user_admin')
                .select('role')
                .eq(userIdColumn, userId)
                .eq('role', 'admin');

              if (error) {
                console.error('Error checking admin role:', error);
                setIsAdmin(false);
              } else {
                // Check if we got any results back
                setIsAdmin(Array.isArray(data) && data.length > 0);
              }
            } catch (innerError) {
              console.error('Error in admin check:', innerError);
              setIsAdmin(false);
            }
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error('Error in admin check:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    };

    checkAdminRole();
  }, [user]);

  if (loading) {
    return <Spinner className='w-10 h-10' />;
  }

  // Không bypass, kiểm tra quyền thực tế
  if (!user || !isAdmin) {
    return (
      <div className='flex flex-col items-center justify-center h-96'>
        <h2 className='text-2xl font-bold text-red-600 mb-4'>
          Bạn không có quyền truy cập
        </h2>
        <p className='text-gray-600 mb-6'>
          Vui lòng đăng nhập bằng tài khoản admin để truy cập trang này.
        </p>
      </div>
    );
  }

  return <Outlet />;
};

export default AdminRoute;
