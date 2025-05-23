import { Outlet } from 'react-router-dom';
import AdminSideBar from './AdminSideBar';

const AdminLayout = () => {
  return (
    <div className='flex min-h-screen bg-gray-50'>
      {/* Sidebar */}
      <AdminSideBar />

      {/* Main Content */}
      <div className='flex-1 flex flex-col'>
        {/* Content */}
        <main className='flex-1 p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
