import { useEffect, useState } from 'react';
// import { fetchProducts } from '@srcs/components/services/productService';
import Button from '@/components/ui/Button';

const ProductGrid = ({ filter, sort }) => {
  // const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        // const data = await fetchProducts(filter, sort);
        // setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [filter, sort]);

  if (loading) {
    return <div className="p-8 text-center">Đang tải sản phẩm...</div>;
  }

  // return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
      {/* {products.map(product => ( */}
        {/* <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow"> */}
          <img 
            // src={product.image} 
            // alt={product.name}
            className="w-full h-40 object-contain mb-4"
          />
          {/* <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3> */}
          {/* <p className="text-red-600 font-bold mb-4">{product.price} VNĐ</p> */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              Chi tiết
            </Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              Chọn
            </Button>
          </div>
        </div>
      {/* ))} */}
    // </div>
  // );
};

export default ProductGrid;