import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/components/services/supabase";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (user) {
        const {
          data: { user: userData },
        } = await supabase.auth.getUser();
        setIsAdmin(userData?.user_metadata?.role === "admin");
      }
      setLoading(false);
    };

    checkAdminRole();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
