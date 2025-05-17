import { useForm } from 'react-hook-form';

export function useForgotPasswordLogic(onSubmitHandler) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return {
    register,
    handleSubmit: handleSubmit(onSubmitHandler),
    errors,
  };
}
