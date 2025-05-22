import { Route, Navigate } from 'react-router-dom';
import ProductManager from './components/pages/admin/ProductManager';
import UserManager from './components/pages/admin/UserManager';
import OrderManager from './components/pages/admin/OrderManager';
import AdminRoute from './components/routes/AdminRoute';
import AdminLayout from './components/ui/AdminLayout';
import Dashboard from './components/pages/admin/Dashboard';
import { lazy, Suspense } from 'react';
import { 
  MdDashboard, 
  MdInventory, 
  MdPeople, 
  MdShoppingCart, 
  MdInsights, 
  MdSettings, 
  MdFeedback 
} from 'react-icons/md';

// Lazy-loaded components for better performance
const Analytics = lazy(() => import('./components/pages/admin/Analytics'));
const Settings = lazy(() => import('./components/pages/admin/Settings'));
const CustomerFeedback = lazy(() => import('./components/pages/admin/CustomerFeedback'));

// Loading component for suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center w-full h-64">
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 border-t-4 border-b-4 border-red-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-medium text-gray-700">Đang tải...</p>
    </div>
  </div>
);

// Define routes with icons for the sidebar
export const adminRoutes = [
  { 
    path: '', 
    name: 'Tổng quan', 
    component: <Dashboard />, 
    icon: <MdDashboard /> 
  },
  { 
    path: 'products', 
    name: 'Quản lý sản phẩm', 
    component: <ProductManager />, 
    icon: <MdInventory /> 
  },
  { 
    path: 'user', 
    name: 'Quản lý người dùng', 
    component: <UserManager />, 
    icon: <MdPeople /> 
  },
  { 
    path: 'order', 
    name: 'Quản lý đơn hàng', 
    component: <OrderManager />, 
    icon: <MdShoppingCart /> 
  },
  { 
    path: 'analytics', 
    name: 'Phân tích bán hàng', 
    component: (
      <Suspense fallback={<LoadingFallback />}>
        <Analytics />
      </Suspense>
    ), 
    icon: <MdInsights /> 
  },
  { 
    path: 'feedback', 
    name: 'Phản hồi khách hàng', 
    component: (
      <Suspense fallback={<LoadingFallback />}>
        <CustomerFeedback />
      </Suspense>
    ), 
    icon: <MdFeedback /> 
  },
  { 
    path: 'settings', 
    name: 'Cài đặt hệ thống', 
    component: (
      <Suspense fallback={<LoadingFallback />}>
        <Settings />
      </Suspense>
    ), 
    icon: <MdSettings /> 
  },
];

// Create admin routes
const adminRoute = (
  <Route
    path='/admin'
    element={
      <AdminRoute>
        <AdminLayout routes={adminRoutes} />
      </AdminRoute>
    }
  >
    {/* Home route redirects to dashboard */}
    <Route index element={adminRoutes[0].component} />
    
    {/* Map all routes from adminRoutes array */}
    {adminRoutes.slice(1).map((route) => (
      <Route key={route.path} path={route.path} element={route.component} />
    ))}

    {/* Redirect the typo 'oder' to 'order' */}
    <Route path='oder' element={<Navigate to="/admin/order" replace />} />
    
    {/* Catch-all route for 404 within admin section */}
    <Route path="*" element={
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy trang</h2>
        <p className="text-gray-600 mb-6">Trang bạn đang tìm kiếm không tồn tại trong hệ thống quản trị.</p>
        <button 
          onClick={() => window.location.href = '/admin'}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Quay lại Dashboard
        </button>
      </div>
    } />
  </Route>
);

export default adminRoute;
