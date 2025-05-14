import ProductRow from "@/components/features/products/ProductRow";

function ProductPage() {
  const products = [
    {
      title: "Laptop ASUS Vivobook S 14 S5406SA PP059WS",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/14d7674475caa6ad9b0bf8c51046aa7cfeb8e859",
      banner:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/13735805a37f3fd4d5c005a3b4b28e67eae6d201",
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
      banner:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/028303d0a9ef2b9b32394162f5bcea2dbb648f01",
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
      banner:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/4de9b88a5c74eec52f4d1db5173051a8a495243b",
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
      banner:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/7e0f00fe78761fbab00b7a9e51cdad4ea28dce18",
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
      banner:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/7518d3a96bd98eab8f5a2e1a0a63afa1988b9f42",
      originalPrice: "20.990.000₫",
      salePrice: "17.290.000₫",
      discount: "-18%",
      rating: "0.0",
      reviewCount: 0,
    },
  ];

  return (
    <main className="bg-gray-200 w-full min-h-screen p-6 flex justify-center">
      <div className="max-w-[1200px] w-full">
        <ProductRow products={products} />
      </div>
    </main>
  );
}

export default ProductPage;
