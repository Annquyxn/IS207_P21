// src/layouts/AdminLayout.jsx
import { Outlet } from 'react-router-dom';
import AdminSideBar from './AdminSideBar';

const AdminLayout = () => {
  return (
    <div className='flex min-h-screen'>
      {/* Sidebar */}
      <AdminSideBar />

      {/* Nội dung */}
      <main className='flex-1 bg-gray-100 p-6'>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
