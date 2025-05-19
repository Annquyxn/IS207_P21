import { Route } from "react-router-dom";
import ProductManager from "./components/pages/admin/ProductManager";
import UserManager from "./components/pages/admin/UserManager";
import OrderManager from "./components/pages/admin/OrderManager";
import AdminRoute from "./components/routes/AdminRoute";
import AdminLayout from "./components/ui/AdminLayout";
import Dashboard from "./components/pages/admin/Dashboard";
import ResetPasswordForm from "@/components/features/auth/ResetPasswordForm";

const adminRoute = (
  <Route
    path="/admin"
    element={
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    }
  >
    <Route index element={<Dashboard />} />
    <Route path="products" element={<ProductManager />} />
    <Route path="user" element={<UserManager />} />
    <Route path="order" element={<OrderManager />} />
    <Route path="reset-password" element={<ResetPasswordForm />} />
  </Route>
);

export default adminRoute;
