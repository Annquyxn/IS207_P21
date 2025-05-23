import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { apiLogin } from '@/components/services/apiLogin';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { supabase } from '@/components/services/supabase';

export function useLoginFormLogic() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: apiLogin,

    onSuccess: async (user) => {
      try {
        setLoginError('');
        localStorage.setItem('user', JSON.stringify(user));

        const { error } = await supabase.auth.getSession();
        if (error) {
          setLoginError('Lỗi khi cập nhật phiên đăng nhập');
          return;
        }

        navigate('/home', { replace: true });
      } catch (error) {
        console.error('Error in login success handler:', error);
        setLoginError('Có lỗi xảy ra sau khi đăng nhập');
      }
    },

    onError: (error) => {
      console.error('Login error:', error);
      setLoginError(error.message || 'Đăng nhập thất bại');
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isLoading: mutation.isLoading,
    loginError,
  };
}
