import { useEffect, useState } from "react";
import ProductSkeleton from "@/components/features/products/ProductSkeleton";
import ProductPage from "@/components/pages/ProductPage";

const ProductGrid = ({ filter, sort }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        // const data = await fetchProducts(filter, sort);
        // setProducts(data);
        setProducts([]); // Giả lập không có sản phẩm
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [filter, sort]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col justify-between min-h-screen p-8">
        <div className="text-center text-gray-500 mb-auto">
          <h2 className="text-xl font-semibold">
            Chưa có dữ liệu sản phẩm để hiển thị
          </h2>
        </div>
        <div className="mt-8">
          <ProductPage />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="border rounded-lg p-4 hover:shadow-xl transition-shadow transform hover:scale-105 duration-300"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-40 object-contain mb-4"
          />
          <h3 className="font-bold text-lg mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-red-600 font-bold mb-4">{product.price} VNĐ</p>
          <div className="flex gap-6">
            <button className="flex-1 py-4 px-8 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 hover:shadow-md transition-all duration-300 text-lg">
              Xem thêm
            </button>
          </div>
        </div>
      ))}

      <div className="mt-8">
        <ProductPage />
      </div>
    </div>
  );
};

export default ProductGrid;
