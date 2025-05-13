import { FaRegUser, FaBoxOpen } from 'react-icons/fa';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { BiTime } from 'react-icons/bi';
import { FiLogOut } from 'react-icons/fi';

function Sidebar() {
  return (
    <div className='bg-white border rounded-xl w-full md:w-64 shadow p-4'>
      <div className='text-center mb-4'>
        <div className='w-16 h-16 rounded-full bg-gray-200 mx-auto mb-2'></div>
        <h2 className='font-semibold text-lg'>Nguyễn Văn A</h2>
      </div>

      <hr className='my-3' />

      <nav className='flex flex-col gap-3'>
        <SidebarItem icon={<FaRegUser />} label='Thông tin tài khoản' active />
        <SidebarItem icon={<HiOutlineLocationMarker />} label='Địa chỉ' />
        <SidebarItem icon={<FaBoxOpen />} label='Quản lý đơn hàng' />
        <SidebarItem icon={<BiTime />} label='Lịch sử' />
        <SidebarItem icon={<FiLogOut />} label='Đăng xuất' />
      </nav>
    </div>
  );
}

function SidebarItem({ icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer
        ${
          active
            ? 'text-red-600 font-semibold'
            : 'text-gray-800 hover:bg-gray-100'
        }`}
    >
      <div className='text-xl'>{icon}</div>
      <span className='text-sm'>{label}</span>
    </div>
  );
}

export default Sidebar;
