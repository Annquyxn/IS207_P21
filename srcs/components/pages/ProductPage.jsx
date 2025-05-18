import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import ProductFilters from "@/components/features/products/ProductFilters";
import ProductRow from "@/components/features/products/ProductRow";
import { fetchProducts } from "@/components/features/products/apiProduct";
import { parsePrice } from "@/utils/parsePrice";
import { ActiveFilters } from "../features/products/ProductFilters";
import Spinner from "../ui/Spinner";

function ProductPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get("category");

  const [selectedBrand, setSelectedBrand] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priceRange: null,
    cpu: null,
    socket: null,
    category: categoryParam || null,
  });

  // Update category filter when URL parameter changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: categoryParam || null,
    }));
  }, [categoryParam]);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        // Pass the category parameter to fetchProducts
        const data = await fetchProducts(filters.category);
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [filters.category]);

  const processedProducts = useMemo(() => {
    let filtered = products;

    if (selectedBrand !== "all") {
      filtered = filtered.filter((p) => p.brand === selectedBrand);
    }

    if (filters.priceRange) {
      filtered = filtered.filter((p) => {
        try {
          const price = parsePrice(p.salePrice);
          switch (filters.priceRange) {
            case "Dưới 1 triệu":
              return price < 1_000_000;
            case "1-3 triệu":
              return price >= 1_000_000 && price <= 3_000_000;
            case "3-5 triệu":
              return price >= 3_000_000 && price <= 5_000_000;
            case "Trên 5 triệu":
              return price > 5_000_000;
            default:
              return true;
          }
        } catch (e) {
          console.error("Error parsing price:", e);
          return false;
        }
      });
    }

    if (filters.cpu) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(filters.cpu.toLowerCase())
      );
    }

    if (filters.socket) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(filters.socket.toLowerCase())
      );
    }

    // If keyboard category is selected, it's already filtered by the API
    // as the fetchProducts function is fetching from the keyboards table

    return [...filtered].sort((a, b) => {
      if (sortBy === "price-asc") {
        const priceA = parsePrice(a.salePrice);
        const priceB = parsePrice(b.salePrice);
        return priceA - priceB;
      }
      if (sortBy === "price-desc") {
        const priceA = parsePrice(a.salePrice);
        const priceB = parsePrice(b.salePrice);
        return priceB - priceA;
      }
      return 0;
    });
  }, [products, selectedBrand, filters, sortBy]);

  useEffect(() => {
    setVisibleProducts(processedProducts.slice(0, 15));
  }, [processedProducts]);

  const loadMore = () => {
    setVisibleProducts((prev) => [
      ...prev,
      ...processedProducts.slice(prev.length, prev.length + 10),
    ]);
  };

  return (
    <main className="bg-gray-200 w-full min-h-screen p-6 flex justify-center">
      <div className="max-w-[1200px] w-full">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <ProductFilters
            selectedBrand={selectedBrand}
            onBrandChange={setSelectedBrand}
            sortBy={sortBy}
            onSortChange={setSortBy}
            filters={filters}
            onFilterChange={(key, value) =>
              setFilters((prev) => ({ ...prev, [key]: value }))
            }
          />
        </div>
        <ActiveFilters
          selectedBrand={selectedBrand}
          filters={filters}
          onClearBrand={() => setSelectedBrand("all")}
          onClearFilter={(key) =>
            setFilters((prev) => ({ ...prev, [key]: null }))
          }
          onClearAll={() => {
            setSelectedBrand("all");
            setFilters({
              priceRange: null,
              cpu: null,
              socket: null,
              category: null,
            });
          }}
        />

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner className="w-12 h-12 text-blue-500" />
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        ) : (
          <>
            {categoryParam && (
              <h2 className="text-2xl font-bold mb-4">
                {categoryParam === "keyboard" && "Bàn phím"}
                {categoryParam === "ssd" && "SSD Laptop"}
                {categoryParam === "headphone" && "Tai Nghe"}
                {categoryParam === "pccooling" && "Tản nhiệt PC"}
                {categoryParam === "mouse" && "Chuột +  Lót chuột"}
                {categoryParam === "pcgaming" && "PC GVN"}
                {categoryParam === "laptop" && "Laptop"}
                {categoryParam === "laptop_do_hoa" && "Laptop Đồ họa"}
                {categoryParam === "laptop_doanh_nhan" && "Laptop Doanh nhân"}
                {categoryParam === "laptop_gaming" && "Laptop Gaming"}
                {categoryParam === "laptop_van_phong" && "Laptop Văn Phòng"}
                {categoryParam === "laptop_asus_oled" && "ASUS OLED Series"}
                {categoryParam === "laptop_asus_vivobook" && "Vivobook Series"}
                {categoryParam === "laptop_asus_zenbook" && "Zenbook Series"}
                {categoryParam === "laptop_tuf_gaming" && "ASUS TUF Gaming"}
                {categoryParam === "laptop_rog_strix" && "ASUS ROG Strix"}
                {categoryParam === "laptop_rog_zephyrus" && "ASUS ROG Zephyrus"}
                {categoryParam === "laptop_acer_aspire" && "Aspire Series"}
                {categoryParam === "laptop_acer_swift" && "Swift Series"}
                {categoryParam === "laptop_acer_predator_helios" &&
                  "Acer Predator Helios"}
                {categoryParam === "laptop_acer_nitro" && "Acer Nitro 5"}
                {categoryParam === "laptop_msi_cyborg" && "MSI Cyborg Series"}
                {categoryParam === "laptop_msi_katana" && "MSI Katana Series"}
                {categoryParam === "laptop_msi_modern" && "Modern Series"}
                {categoryParam === "laptop_msi_prestige" && "Prestige Series"}
                {categoryParam === "laptop_msi_raider" && "MSI Raider Series"}
              </h2>
            )}
            <ProductRow products={visibleProducts} />
            {visibleProducts.length < processedProducts.length && (
              <button
                className="mt-4 bg-red-500 text-white p-4 rounded-xl mx-auto block text-xl transition-all duration-300 hover:scale-110"
                onClick={loadMore}
              >
                Xem thêm
              </button>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default ProductPage;
