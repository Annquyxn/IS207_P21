import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import Spinner from '../../ui/Spinner';

function UserPage() {
  const navigate = useNavigate();

  const { userInfo } = useUser();
  if (!userInfo) return <Spinner />;

  return (
    <div className='flex-1 bg-white rounded-lg shadow-md p-8 border border-gray-200'>
      <h2 className='text-lg font-semibold mb-6 text-gray-800 border-b pb-4'>
        Thông tin tài khoản
      </h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700'>
        <div className='flex flex-col gap-1'>
          <span className='font-medium'>Họ tên:</span>
          <span>{userInfo.fullName}</span>
        </div>

        <div className='flex flex-col gap-1'>
          <span className='font-medium'>Giới tính:</span>
          <span>{userInfo.gender}</span>
        </div>

        <div className='flex flex-col gap-1'>
          <span className='font-medium'>Số điện thoại:</span>
          <span>{userInfo.phone}</span>
        </div>

        <div className='flex flex-col gap-1'>
          <span className='font-medium'>Email:</span>
          <span>{userInfo.email}</span>
        </div>

        <div className='flex flex-col gap-1 col-span-1 sm:col-span-2'>
          <span className='font-medium'>Ngày sinh:</span>
          <span>
            {userInfo.dob.day}/{userInfo.dob.month}/{userInfo.dob.year}
          </span>
        </div>
      </div>

      {/* Button */}
      <div className='flex justify-end mt-8'>
        <button
          onClick={() => navigate('/user/update')}
          className='bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition'
        >
          Cập nhật thông tin
        </button>
      </div>
    </div>
  );
}

export default UserPage;
