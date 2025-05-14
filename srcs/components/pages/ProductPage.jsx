import React, { useState } from "react";
import ProductRow from "@/components/features/products/ProductRow";
import ProductFilters from "@/components/features/products/ProductFilters";
import ProductGrid from "@/components/features/products/ProductGrid";

function ProductPage() {
  const products = [
    {
      title: "Laptop ASUS Vivobook S 14 S5406SA PP059WS",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/14d7674475caa6ad9b0bf8c51046aa7cfeb8e859",
      originalPrice: "35.990.000₫",
      salePrice: "34.490.000₫",
      discount: "-4%",
      rating: "0.0",
      reviewCount: 0,
    },
    {
      title: "Laptop ASUS Vivobook S 14 S5406SA PP060WS",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/0e034c96f04da867a3f45f69c37c86c4ba26caf7",
      originalPrice: "28.900.000₫",
      salePrice: "26.490.000₫",
      discount: "-9%",
      rating: "0.0",
      reviewCount: 0,
    },
    {
      title: "Laptop ASUS ExpertBook P1 P1503CVA i5SE16 50W",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/522e17246e8fc4e5d0a6de9f3e27181659f1bcbd",
      originalPrice: "16.590.000₫",
      salePrice: "15.790.000₫",
      discount: "-4%",
      rating: "0.0",
      reviewCount: 0,
    },
    {
      title: "Laptop ASUS Vivobook S 14 OLED S5406MA PP046WS",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/a7e312c82ad02315a23a612b9320e7b486df86a9",
      originalPrice: "26.990.000₫",
      salePrice: "24.790.000₫",
      discount: "-8%",
      rating: "0.0",
      reviewCount: 0,
    },
    {
      title: "Laptop gaming ASUS Vivobook 16X K3605ZF RP634W",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/f5c43f5964bec398122def99fa32667b01a8c854",
      originalPrice: "20.990.000₫",
      salePrice: "17.290.000₫",
      discount: "-18%",
      rating: "0.0",
      reviewCount: 0,
    },
    {
      title: "Laptop gaming Acer Nitro 5 Tiger AN515-58-52SP",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/a1d57f81c95d0f8a119ad0e18ebfdcbb",
      originalPrice: "23.990.000₫",
      salePrice: "19.990.000₫",
      discount: "-17%",
      rating: "4.5",
      reviewCount: 120,
    },
    {
      title: "Laptop gaming MSI Katana GF66 12UD-467VN",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/f9a7a124ecadcf248ea39efad69c750f",
      originalPrice: "26.990.000₫",
      salePrice: "21.490.000₫",
      discount: "-20%",
      rating: "4.2",
      reviewCount: 89,
    },
    {
      title: "Laptop gaming Lenovo LOQ 15IRH8 i5-12450H",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/35a8bffec173ecfea0f45826ad91b2c7",
      originalPrice: "22.490.000₫",
      salePrice: "18.790.000₫",
      discount: "-17%",
      rating: "4.8",
      reviewCount: 214,
    },
    {
      title: "Laptop gaming HP Victus 16 e1107AX R5 6600H",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/8f8c195e75e888c7e5cfc5db5469a28e",
      originalPrice: "20.990.000₫",
      salePrice: "17.690.000₫",
      discount: "-16%",
      rating: "4.3",
      reviewCount: 57,
    },
    {
      title: "Laptop gaming ASUS TUF Gaming F15 FX507ZC4",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/0b4cc6b63cde4f37b63a1ab6c1ed1b2e",
      originalPrice: "24.990.000₫",
      salePrice: "20.490.000₫",
      discount: "-18%",
      rating: "4.6",
      reviewCount: 134,
    },
    {
      title: "Laptop Lenovo Legion 5 Pro 16ARH7H",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/8a52c66c1f64d4ffb8ca59d5a2f94f5e",
      originalPrice: "32.990.000₫",
      salePrice: "28.990.000₫",
      discount: "-12%",
      rating: "4.8",
      reviewCount: 250,
    },
    {
      title: "Laptop Lenovo ThinkPad X1 Carbon Gen 10",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/fb84a5e73a7048bdb36cf5b6b6f0135d",
      originalPrice: "45.990.000₫",
      salePrice: "39.990.000₫",
      discount: "-13%",
      rating: "4.7",
      reviewCount: 180,
    },
    {
      title: "Laptop Lenovo IdeaPad 3 15ADA6",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/aa2dbb97cfb14d23976200fa96ed3a1a",
      originalPrice: "13.990.000₫",
      salePrice: "11.990.000₫",
      discount: "-14%",
      rating: "4.5",
      reviewCount: 80,
    },
    {
      title: "Laptop Lenovo Yoga 9i 14",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/3db0d49ac68b4f2b9e37f5c1a81e0513",
      originalPrice: "32.490.000₫",
      salePrice: "29.990.000₫",
      discount: "-8%",
      rating: "4.9",
      reviewCount: 120,
    },
    {
      title: "Laptop Lenovo Legion Slim 7i",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/5470d11f622e47de9bfc9e5126fc3250",
      originalPrice: "36.990.000₫",
      salePrice: "33.990.000₫",
      discount: "-8%",
      rating: "4.7",
      reviewCount: 110,
    },
    {
      title: "Laptop Gigabyte HP Gaming 1",
      image: "https://via.placeholder.com/150", // Thay hình ảnh của Gigabyte HP
      originalPrice: "40.000.000₫",
      salePrice: "37.500.000₫",
      discount: "-6%",
      rating: "4.5",
      reviewCount: 120,
    },
    {
      title: "Laptop Gigabyte HP Gaming 2",
      image: "https://via.placeholder.com/150",
      originalPrice: "42.000.000₫",
      salePrice: "39.000.000₫",
      discount: "-7%",
      rating: "4.6",
      reviewCount: 115,
    },
    {
      title: "Laptop Gigabyte HP Gaming 3",
      image: "https://via.placeholder.com/150",
      originalPrice: "45.000.000₫",
      salePrice: "41.500.000₫",
      discount: "-8%",
      rating: "4.7",
      reviewCount: 130,
    },
    {
      title: "Laptop Gigabyte HP Gaming 4",
      image: "https://via.placeholder.com/150",
      originalPrice: "47.000.000₫",
      salePrice: "43.000.000₫",
      discount: "-9%",
      rating: "4.8",
      reviewCount: 140,
    },
    {
      title: "Laptop Gigabyte HP Gaming 5",
      image: "https://via.placeholder.com/150",
      originalPrice: "48.500.000₫",
      salePrice: "45.000.000₫",
      discount: "-7%",
      rating: "4.6",
      reviewCount: 125,
    },
    {
      title: "Laptop Gigabyte HP Gaming 6",
      image: "https://via.placeholder.com/150",
      originalPrice: "50.000.000₫",
      salePrice: "46.500.000₫",
      discount: "-6%",
      rating: "4.5",
      reviewCount: 110,
    },
    {
      title: "Laptop Gigabyte HP Gaming 7",
      image: "https://via.placeholder.com/150",
      originalPrice: "51.000.000₫",
      salePrice: "47.000.000₫",
      discount: "-8%",
      rating: "4.7",
      reviewCount: 135,
    },
    {
      title: "Laptop Gigabyte HP Gaming 8",
      image: "https://via.placeholder.com/150",
      originalPrice: "52.500.000₫",
      salePrice: "48.500.000₫",
      discount: "-7%",
      rating: "4.6",
      reviewCount: 120,
    },
    {
      title: "Laptop Gigabyte HP Gaming 9",
      image: "https://via.placeholder.com/150",
      originalPrice: "53.000.000₫",
      salePrice: "49.500.000₫",
      discount: "-7%",
      rating: "4.8",
      reviewCount: 140,
    },
    {
      title: "Laptop Gigabyte HP Gaming 10",
      image: "https://via.placeholder.com/150",
      originalPrice: "55.000.000₫",
      salePrice: "51.000.000₫",
      discount: "-8%",
      rating: "4.7",
      reviewCount: 150,
    },
  ];

  const [visibleProducts, setVisibleProducts] = useState(products.slice(0, 15));

  const loadMore = () => {
    setVisibleProducts((prevVisibleProducts) => [
      ...prevVisibleProducts,
      ...products.slice(
        prevVisibleProducts.length,
        prevVisibleProducts.length + 10
      ),
    ]);
  };

  return (
    <main className="bg-gray-200 w-full min-h-screen p-6 flex justify-center">
      <div className="max-w-[1200px] w-full">
        <ProductRow products={visibleProducts} />
        {visibleProducts.length < products.length && (
          <button
            className="mt-4 bg-red-500 text-white p-4 rounded-xl mx-auto block text-xl transition-all duration-300 hover:scale-110"
            onClick={loadMore}
          >
            Xem thêm
          </button>
        )}
      </div>
    </main>
  );
}

export default ProductPage;
