import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { registerAddressForm } from '@/components/services/apiAddress';
import Spinner from '@/components/ui/Spinner';

function AddressForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      fullName: '',
      phone: '',
      gender: 'male',
      city: '',
      district: '',
      ward: '',
      street: '',
      note: '',
      shippingMethod: 'standard',
    },
  });

  const mutation = useMutation({
    mutationFn: (formData) => registerAddressForm({ addressData: formData }),
    onSuccess: () => {
      alert('Address saved successfully!');
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

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
        <label className='flex items-center gap-2 cursor-pointer text-lg'>
          <input
            type='radio'
            className='hidden'
            {...register('gender')}
            value='male'
          />
          <div
            className={`w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center ${
              selectedGender === 'male' ? 'bg-blue-500' : 'bg-white'
            }`}
          >
            {selectedGender === 'male' && (
              <div className='w-3 h-3 rounded-full bg-white'></div>
            )}
          </div>
          <span>Anh</span>
        </label>
        <label className='flex items-center gap-2 cursor-pointer text-lg'>
          <input
            type='radio'
            className='hidden'
            {...register('gender')}
            value='female'
          />
          <div
            className={`w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center ${
              selectedGender === 'female' ? 'bg-pink-500' : 'bg-white'
            }`}
          >
            {selectedGender === 'female' && (
              <div className='w-3 h-3 rounded-full bg-white'></div>
            )}
          </div>
          <span>Chị</span>
        </label>
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
            {/* Add your city options here */}
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
            {/* Add your district options here */}
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
      {/* Ghi chú */}
      <div>
        <input
          type='text'
          placeholder='Ghi chú thêm'
          className='w-full min-h-[50px] border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
          {...register('note')}
        />
      </div>
      {/* Dịch vụ giao hàng */}
      <h3 className='text-2xl font-semibold text-gray-700 mt-6'>
        Dịch vụ giao hàng
      </h3>
      <div className='flex flex-wrap items-center gap-6'>
        <label className='flex items-center gap-2 cursor-pointer text-lg'>
          <input
            type='radio'
            className='hidden'
            {...register('shippingMethod')}
            value='standard'
          />
          <div
            className={`w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center ${
              selectedShippingMethod === 'standard' ? 'bg-blue-500' : 'bg-white'
            }`}
          >
            {selectedShippingMethod === 'standard' && (
              <div className='w-3 h-3 rounded-full bg-white'></div>
            )}
          </div>
          <span>Giao hàng tiết kiệm</span>
        </label>
        <span className='text-red-600 text-sm'>
          Dự kiến nhận hàng trong 2-3 ngày
        </span>
      </div>
      <label className='flex items-center gap-2 cursor-pointer text-lg'>
        <input
          type='radio'
          className='hidden'
          {...register('shippingMethod')}
          value='express'
        />
        <div
          className={`w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center ${
            selectedShippingMethod === 'express' ? 'bg-blue-500' : 'bg-white'
          }`}
        >
          {selectedShippingMethod === 'express' && (
            <div className='w-3 h-3 rounded-full bg-white'></div>
          )}
        </div>
        <span>Giao hàng nhanh</span>
      </label>
      {/* Submit Button */}
      <button
        type='submit'
        disabled={mutation.isLoading}
        className={`
    mt-6 px-6 py-3 font-semibold rounded-lg flex items-center justify-center gap-2
    transition-all duration-300 ease-in-out transform
    ${
      mutation.isSuccess
        ? 'bg-green-600 hover:bg-green-700'
        : 'bg-blue-600 hover:bg-blue-700'
    }
    text-white
    ${
      mutation.isLoading
        ? 'opacity-80 cursor-not-allowed'
        : 'hover:-translate-y-1'
    }
  `}
      >
        {mutation.isLoading ? (
          <>
            <Spinner size={18} color='white' />
            Đang gửi...
          </>
        ) : mutation.isSuccess ? (
          'Gửi thành công'
        ) : (
          'Gửi địa chỉ'
        )}
      </button>
    </form>
  );
}

export default AddressForm;
