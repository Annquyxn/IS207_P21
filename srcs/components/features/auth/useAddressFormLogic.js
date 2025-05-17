import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { registerAddressForm } from '@/components/services/apiAddress';

export function useAddressFormLogic() {
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
    onSuccess: () => alert('Lưu địa chỉ thành công!'),
    onError: (error) => alert(`Lỗi: ${error.message}`),
  });

  const onSubmit = (data) => mutation.mutate(data);

  return {
    register,
    handleSubmit,
    errors,
    watch,
    onSubmit,
    isLoading: mutation.isLoading,
    isSuccess: mutation.isSuccess,
  };
}
