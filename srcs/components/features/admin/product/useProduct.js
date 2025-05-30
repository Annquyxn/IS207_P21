<<<<<<< HEAD
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../../../services/apiProduct';

export function useProduct() {
  const { isLoading, data: products } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  return {
    isLoading,
    products: products ?? [],
  };
}
=======
import { useQuery } from '@tanstack/react-query';
import { getProduct } from '../../../services/apiProduct';

export function useProduct() {
  const { isLoading, data: products } = useQuery({
    queryKey: ['products'],
    queryFn: getProduct,
  });

  return {
    isLoading,
    products: products ?? [],
  };
}
>>>>>>> old-version
