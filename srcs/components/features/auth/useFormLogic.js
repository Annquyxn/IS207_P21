import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { apiLogin } from '@/components/services/apiLogin';
import { useNavigate } from 'react-router-dom';

export function useLoginFormLogic() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: apiLogin,
    onSuccess: (user) => {
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    },
    onError: (error) => {
      alert(error.message || 'Đăng nhập thất bại');
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isLoading: mutation.isLoading,
  };
}
