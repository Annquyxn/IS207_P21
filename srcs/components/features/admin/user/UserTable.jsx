// src/components/admin/UserTable.jsx
import { motion } from 'framer-motion';
import { FiEdit, FiUserX } from 'react-icons/fi';
import AnimatedButton from '../../../ui/AnimatedButton';

const UserTable = ({ users, handleRoleUpdate, handleDeleteUser }) => {
  if (!users || users.length === 0) {
    return (
      <tr>
        <td colSpan='5' className='px-6 py-4 text-center text-gray-500'>
          Không tìm thấy người dùng nào
        </td>
      </tr>
    );
  }

  return users.map((user) => (
    <motion.tr
      key={user.id}
      initial='hidden'
      animate='visible'
      whileHover={{ backgroundColor: '#f9fafb' }}
    >
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='flex items-center'>
          <div className='h-10 w-10 rounded-full bg-gradient-to-br from-red-100 to-red-200 text-red-600 flex items-center justify-center'>
            <span className='text-lg font-medium'>
              {user.full_name?.[0]?.toUpperCase() ||
                user.email[0].toUpperCase()}
            </span>
          </div>
          <div className='ml-4'>
            <div className='text-sm font-medium text-gray-900'>
              {user.full_name || 'Chưa cập nhật'}
            </div>
            {user.phone && (
              <div className='text-xs text-gray-500'>{user.phone}</div>
            )}
          </div>
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-900'>{user.email}</div>
        <div className='text-xs text-gray-500'>
          {user.last_sign_in
            ? `Đăng nhập gần nhất: ${new Date(
                user.last_sign_in
              ).toLocaleDateString('vi-VN')}`
            : 'Chưa đăng nhập'}
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <select
          className={`px-2.5 py-1 text-xs leading-5 rounded-full border-0 ${
            user.role === 'admin'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-green-100 text-green-800'
          }`}
          value={user.role}
          onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
        >
          <option value='user'>Người dùng</option>
          <option value='admin'>Quản trị viên</option>
        </select>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
        {new Date(user.created_at).toLocaleDateString('vi-VN')}
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
        <div className='flex space-x-3'>
          <AnimatedButton className='text-blue-600 hover:text-blue-900 flex items-center'>
            <FiEdit className='w-4 h-4 mr-1' />
            Sửa
          </AnimatedButton>
          <AnimatedButton
            className='text-red-600 hover:text-red-900 flex items-center'
            onClick={() => handleDeleteUser(user.id)}
          >
            <FiUserX className='w-4 h-4 mr-1' />
            Xoá
          </AnimatedButton>
        </div>
      </td>
    </motion.tr>
  ));
};

export default UserTable;
