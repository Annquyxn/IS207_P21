import { useState, useEffect } from 'react';

function AccountForm() {
  const currentYear = new Date().getFullYear();

  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [days, setDays] = useState([]);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: currentYear - 1949 }, (_, i) => 1950 + i);

  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  useEffect(() => {
    const getDaysInMonth = (month, year) => {
      if (!month || !year) return [];
      const daysInMonth = [
        31,
        isLeapYear(year) ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
      ];
      return Array.from({ length: daysInMonth[month - 1] }, (_, i) => i + 1);
    };

    if (selectedMonth && selectedYear) {
      setDays(getDaysInMonth(Number(selectedMonth), Number(selectedYear)));
    }
  }, [selectedMonth, selectedYear]);

  return (
    <div className='bg-white rounded-xl shadow p-6 w-full'>
      <h2 className='text-lg font-semibold mb-4'>Cập nhật thông tin</h2>

      <form className='space-y-4'>
        <div>
          <label className='block text-sm font-medium mb-1'>Họ tên:</label>
          <input
            type='text'
            placeholder='Nhập họ và tên'
            className='w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-red-500'
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Giới tính:</label>
          <div className='flex gap-4 items-center'>
            <label className='flex items-center gap-1'>
              <input type='radio' name='gender' value='male' />
              Nam
            </label>
            <label className='flex items-center gap-1'>
              <input type='radio' name='gender' value='female' />
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
            placeholder='Nhập số điện thoại'
            className='w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-red-500'
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Email:</label>
          <input
            type='email'
            placeholder='Nhập email'
            className='w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-red-500'
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Ngày sinh:</label>
          <div className='flex gap-4'>
            {/* Ngày */}
            <select
              className='w-full border border-gray-300 rounded-md px-2 py-2'
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              disabled={!days.length}
            >
              <option value=''>Ngày</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>

            {/* Tháng */}
            <select
              className='w-full border border-gray-300 rounded-md px-2 py-2'
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value=''>Tháng</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>

            {/* Năm */}
            <select
              className='w-full border border-gray-300 rounded-md px-2 py-2'
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value=''>Năm</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='flex justify-end gap-4 mt-4'>
          <button
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
