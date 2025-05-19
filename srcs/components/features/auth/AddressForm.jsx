import Spinner from '@/components/ui/Spinner';
import { useAddressFormLogic } from './useAddressFormLogic';

function AddressForm({ onSubmitSuccess }) {
  const {
    register,
    handleSubmit,
    errors,
    watch,
    onSubmit: originalOnSubmit,
    isLoading,
    isSuccess,
  } = useAddressFormLogic();

  // Wrap original submit handler to also call onSubmitSuccess prop if provided
  const onSubmit = (data) => {
    originalOnSubmit(data);
    if (onSubmitSuccess) {
      onSubmitSuccess(data);
    }
  };

  const selectedGender = watch('gender');
  const selectedShippingMethod = watch('shippingMethod');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
      {/* Giới tính */}
      <div className='flex gap-6'>
        {['male', 'female'].map((gender) => (
          <label
            key={gender}
            className='flex items-center gap-2 cursor-pointer text-base'
          >
            <input
              type='radio'
              className='hidden'
              {...register('gender')}
              value={gender}
            />
            <div
              className={`w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center ${
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

      {/* Họ tên và SĐT */}
      <div className='flex flex-col md:flex-row gap-5'>
        <div className='flex-1'>
          <input
            type='text'
            placeholder='Họ và Tên'
            className='w-full min-h-[44px] border border-gray-300 rounded-lg bg-white px-4 py-2 text-base focus:outline-none focus:ring-1 focus:ring-blue-500'
            {...register('fullName', { required: 'Vui lòng nhập họ tên' })}
          />
          {errors.fullName && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.fullName.message}
            </p>
          )}
        </div>
        <div className='flex-1'>
          <input
            type='tel'
            placeholder='Số điện thoại liên lạc'
            className='w-full min-h-[44px] border border-gray-300 rounded-lg bg-white px-4 py-2 text-base focus:outline-none focus:ring-1 focus:ring-blue-500'
            {...register('phone', {
              required: 'Vui lòng nhập số điện thoại',
              pattern: {
                value: /^\d+$/,
                message: 'Số điện thoại không hợp lệ',
              },
            })}
          />
          {errors.phone && (
            <p className='text-red-500 text-sm mt-1'>{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Địa chỉ giao hàng */}
      <h3 className='text-base font-medium text-gray-700 mt-2'>
        Địa chỉ giao hàng
      </h3>
      <div className='flex flex-col md:flex-row gap-5'>
        <div className='flex-1'>
          <select
            className='w-full min-h-[44px] border border-gray-300 rounded-lg bg-white px-4 py-2 text-base focus:outline-none focus:ring-1 focus:ring-blue-500'
            {...register('city', { required: 'Vui lòng chọn tỉnh/thành phố' })}
          >
            <option value=''>Chọn tỉnh/thành phố</option>
            <option value='HCM'>TP Hồ Chí Minh</option>
            <option value='HN'>Hà Nội</option>
            <option value='DN'>Đà Nẵng</option>
          </select>
          {errors.city && (
            <p className='text-red-500 text-sm mt-1'>{errors.city.message}</p>
          )}
        </div>
        <div className='flex-1'>
          <select
            className='w-full min-h-[44px] border border-gray-300 rounded-lg bg-white px-4 py-2 text-base focus:outline-none focus:ring-1 focus:ring-blue-500'
            {...register('district', { required: 'Vui lòng chọn quận/huyện' })}
          >
            <option value=''>Chọn quận/huyện</option>
            <option value='Q1'>Quận 1</option>
            <option value='Q2'>Quận 2</option>
            <option value='Q3'>Quận 3</option>
          </select>
          {errors.district && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.district.message}
            </p>
          )}
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-5'>
        <div className='flex-1'>
          <select
            className='w-full min-h-[44px] border border-gray-300 rounded-lg bg-white px-4 py-2 text-base focus:outline-none focus:ring-1 focus:ring-blue-500'
            {...register('ward', { required: 'Vui lòng chọn phường/xã' })}
          >
            <option value=''>Chọn phường/xã</option>
            <option value='P1'>Phường 1</option>
            <option value='P2'>Phường 2</option>
            <option value='P3'>Phường 3</option>
          </select>
          {errors.ward && (
            <p className='text-red-500 text-sm mt-1'>{errors.ward.message}</p>
          )}
        </div>
        <div className='flex-1'>
          <input
            type='text'
            placeholder='Số nhà, tên đường'
            className='w-full min-h-[44px] border border-gray-300 rounded-lg bg-white px-4 py-2 text-base focus:outline-none focus:ring-1 focus:ring-blue-500'
            {...register('street', { required: 'Vui lòng nhập địa chỉ cụ thể' })}
          />
          {errors.street && (
            <p className='text-red-500 text-sm mt-1'>{errors.street.message}</p>
          )}
        </div>
      </div>

      <input
        type='text'
        placeholder='Ghi chú thêm (tùy chọn)'
        className='w-full min-h-[44px] border border-gray-300 rounded-lg bg-white px-4 py-2 text-base text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500'
        {...register('note')}
      />

      {/* Dịch vụ giao hàng */}
      <h3 className='text-base font-medium text-gray-700 mt-2'>
        Dịch vụ giao hàng
      </h3>
      <div className='space-y-3'>
        {['standard', 'express'].map((method) => (
          <label
            key={method}
            className='flex items-center gap-2 cursor-pointer text-base'
          >
            <input
              type='radio'
              className='hidden'
              {...register('shippingMethod')}
              value={method}
            />
            <div
              className={`w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center ${
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
      </div>

      <button
        type='submit'
        disabled={isLoading}
        className={`mt-4 px-5 py-2.5 font-medium rounded-lg flex items-center justify-center gap-2 text-white text-base transition-all ${
          isSuccess
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-blue-600 hover:bg-blue-700'
        } ${
          isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:-translate-y-0.5'
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
