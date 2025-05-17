import Spinner from '@/components/ui/Spinner';
import { useAddressFormLogic } from './useAddressFormLogic';

function AddressForm() {
  const {
    register,
    handleSubmit,
    errors,
    watch,
    onSubmit,
    isLoading,
    isSuccess,
  } = useAddressFormLogic();

  const selectedGender = watch('gender');
  const selectedShippingMethod = watch('shippingMethod');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
      {/* Họ tên và SĐT */}
      <div className='flex flex-col md:flex-row gap-6'>
        <div className='flex-1'>
          <input
            type='text'
            placeholder='Họ và Tên'
            className='w-full min-h-[50px] border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            {...register('fullName', { required: 'Full name is required' })}
          />
          {errors.fullName && (
            <p className='text-red-500 text-sm mt-2'>
              {errors.fullName.message}
            </p>
          )}
        </div>
        <div className='flex-1'>
          <input
            type='tel'
            placeholder='Số điện thoại liên lạc'
            className='w-full min-h-[50px] border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            {...register('phone', {
              required: 'Phone number is required',
              pattern: {
                value: /^\d+$/,
                message: 'Please enter a valid phone number',
              },
            })}
          />
          {errors.phone && (
            <p className='text-red-500 text-sm mt-2'>{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Giới tính */}
      <div className='flex gap-6'>
        {['male', 'female'].map((gender) => (
          <label
            key={gender}
            className='flex items-center gap-2 cursor-pointer text-lg'
          >
            <input
              type='radio'
              className='hidden'
              {...register('gender')}
              value={gender}
            />
            <div
              className={`w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center ${
                selectedGender === gender
                  ? gender === 'male'
                    ? 'bg-blue-500'
                    : 'bg-pink-500'
                  : 'bg-white'
              }`}
            >
              {selectedGender === gender && (
                <div className='w-3 h-3 rounded-full bg-white'></div>
              )}
            </div>
            <span>{gender === 'male' ? 'Anh' : 'Chị'}</span>
          </label>
        ))}
      </div>

      {/* Địa chỉ giao hàng */}
      <h3 className='text-2xl font-semibold text-gray-700 mt-6'>
        Địa chỉ giao hàng
      </h3>
      <div className='flex flex-col md:flex-row gap-6'>
        <div className='flex-1 min-w-[240px]'>
          <select
            className='w-full min-h-[50px] border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            {...register('city', { required: 'City is required' })}
          >
            <option value=''>Chọn tỉnh/thành phố</option>
          </select>
          {errors.city && (
            <p className='text-red-500 text-sm mt-2'>{errors.city.message}</p>
          )}
        </div>
        <div className='flex-1 min-w-[240px]'>
          <select
            className='w-full min-h-[50px] border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            {...register('district', { required: 'District is required' })}
          >
            <option value=''>Chọn quận/huyện</option>
          </select>
          {errors.district && (
            <p className='text-red-500 text-sm mt-2'>
              {errors.district.message}
            </p>
          )}
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-6'>
        <div className='flex-1 min-w-[240px]'>
          <select
            className='w-full min-h-[50px] border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            {...register('ward', { required: 'Ward is required' })}
          >
            <option value=''>Chọn xã/thị trấn</option>
          </select>
          {errors.ward && (
            <p className='text-red-500 text-sm mt-2'>{errors.ward.message}</p>
          )}
        </div>
        <div className='flex-1'>
          <input
            type='text'
            placeholder='Số nhà, tên đường'
            className='w-full min-h-[50px] border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            {...register('street', { required: 'Street address is required' })}
          />
          {errors.street && (
            <p className='text-red-500 text-sm mt-2'>{errors.street.message}</p>
          )}
        </div>
      </div>

      <input
        type='text'
        placeholder='Ghi chú thêm'
        className='w-full min-h-[50px] border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
        {...register('note')}
      />

      {/* Dịch vụ giao hàng */}
      <h3 className='text-2xl font-semibold text-gray-700 mt-6'>
        Dịch vụ giao hàng
      </h3>
      {['standard', 'express'].map((method) => (
        <label
          key={method}
          className='flex items-center gap-2 cursor-pointer text-lg'
        >
          <input
            type='radio'
            className='hidden'
            {...register('shippingMethod')}
            value={method}
          />
          <div
            className={`w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center ${
              selectedShippingMethod === method ? 'bg-blue-500' : 'bg-white'
            }`}
          >
            {selectedShippingMethod === method && (
              <div className='w-3 h-3 rounded-full bg-white'></div>
            )}
          </div>
          <span>
            {method === 'standard' ? 'Giao hàng tiết kiệm' : 'Giao hàng nhanh'}
          </span>
        </label>
      ))}

      <button
        type='submit'
        disabled={isLoading}
        className={`mt-6 px-6 py-3 font-semibold rounded-lg flex items-center justify-center gap-2 text-white transition-all transform ${
          isSuccess
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-blue-600 hover:bg-blue-700'
        } ${
          isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:-translate-y-1'
        }`}
      >
        {isLoading ? (
          <>
            <Spinner size={18} color='white' />
            Đang gửi...
          </>
        ) : isSuccess ? (
          'Gửi thành công'
        ) : (
          'Gửi địa chỉ'
        )}
      </button>
    </form>
  );
}

export default AddressForm;
