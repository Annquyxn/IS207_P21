import { useNavigate } from 'react-router-dom';
import { useUserForm } from './useUserForm';

function AccountForm() {
  const navigate = useNavigate();
  const { formData, handleChange, handleSubmit, days, months, years } =
    useUserForm();
  return (
    <div className='bg-white rounded-xl shadow p-6 w-full'>
      <h2 className='text-lg font-semibold mb-4'>Cập nhật thông tin</h2>

      <form className='space-y-4' onSubmit={(e) => handleSubmit(e, navigate)}>
        <div>
          <label className='block text-sm font-medium mb-1'>Họ tên:</label>
          <input
            type='text'
            name='fullName'
            value={formData.fullName}
            onChange={handleChange}
            placeholder='Nhập họ và tên'
            className='w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-red-500'
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Giới tính:</label>
          <div className='flex gap-4 items-center'>
            <label className='flex items-center gap-1'>
              <input
                type='radio'
                name='gender'
                value='Nam'
                checked={formData.gender === 'Nam'}
                onChange={handleChange}
              />
              Nam
            </label>
            <label className='flex items-center gap-1'>
              <input
                type='radio'
                name='gender'
                value='Nữ'
                checked={formData.gender === 'Nữ'}
                onChange={handleChange}
              />
              Nữ
            </label>
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>
            Số điện thoại:
          </label>
          <input
            type='tel'
            name='phone'
            value={formData.phone}
            onChange={handleChange}
            placeholder='Nhập số điện thoại'
            className='w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-red-500'
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Email:</label>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='Nhập email'
            className='w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-red-500'
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Ngày sinh:</label>
          <div className='flex gap-4'>
            <select
              name='day'
              className='w-full border border-gray-300 rounded-md px-2 py-2'
              value={formData.day}
              onChange={handleChange}
            >
              <option value=''>Ngày</option>
              {days.map((day) => (
                <option key={day} value={day.toString()}>
                  {day}
                </option>
              ))}
            </select>

            <select
              name='month'
              className='w-full border border-gray-300 rounded-md px-2 py-2'
              value={formData.month}
              onChange={handleChange}
            >
              <option value=''>Tháng</option>
              {months.map((month) => (
                <option key={month} value={month.toString()}>
                  {month}
                </option>
              ))}
            </select>

            <select
              name='year'
              className='w-full border border-gray-300 rounded-md px-2 py-2'
              value={formData.year}
              onChange={handleChange}
            >
              <option value=''>Năm</option>
              {years.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='flex justify-end gap-4 mt-4'>
          <button
            onClick={() => navigate('/user')}
            type='button'
            className='px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300'
          >
            Hủy
          </button>
          <button
            type='submit'
            className='px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700'
          >
            Lưu thông tin
          </button>
        </div>
      </form>
    </div>
  );
}

export default AccountForm;
