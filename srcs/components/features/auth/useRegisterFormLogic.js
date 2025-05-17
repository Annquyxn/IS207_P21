import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { registerUser } from '@/components/services/apiRegister';

export function useRegisterFormLogic() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { fullName, email, password } = data;
      const result = await registerUser({
        full_name: fullName,
        email,
        password,
      });
      alert('Đăng ký thành công!');
    } catch (error) {
      alert('Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return { register, handleSubmit, errors, watch, onSubmit, loading };
}
