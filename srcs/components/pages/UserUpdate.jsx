import AccountForm from '../features/userUpdate/FormAccount';
import Sidebar from '../features/userUpdate/SideBar';

function UserUpdate() {
  return (
    <main className='main-content p-6 bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto flex flex-col md:flex-row gap-10'>
        <Sidebar />
        <AccountForm />
      </div>
    </main>
  );
}

export default UserUpdate;
