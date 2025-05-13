import Sidebar from '../features/user/SideBar';
import { Outlet } from 'react-router-dom';

function User() {
  return (
    <main className='main-content p-6 bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto flex flex-col md:flex-row gap-10'>
        <div className='w-full md:w-72'>
          <Sidebar />
        </div>
        <div className='w-full flex-1'>
          <Outlet />
        </div>
      </div>
    </main>
  );
}

export default User;
