import { useState, useEffect, useRef } from "react";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/solid";
import { useNavigate } from "react-router-dom";

const LaptopCategories = ({ onClose }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const containerRef = useRef();
  const navigate = useNavigate();

  const categories = {
    "Laptop Gaming": {
      items: [
        "PC GVN",
        "Main, CPU, VGA",
        "Case, Nguồn, Tản",
        "Ổ cứng, RAM, Thẻ nhớ",
        "Loa, Micro, Webcam",
        "Màn hình",
        "Bàn phím",
        "Chuột + Lót chuột",
        "Tai Nghe",
        "Ghế - Bàn",
        "Phần mềm, mạng",
        "Handheld, Console",
        "Phụ kiện (Hub, sạc, cặp...)",
        "Dịch vụ và thông tin khác",
      ],
    },
    "Thương hiệu": {
      subcategories: {
        ASUS: [
          "ASUS ROG Zephyrus",
          "ASUS ROG Strix",
          "ASUS TUF Gaming",
          "ASUS OLED Series",
          "Vivobook Series",
          "Zenbook Series",
        ],
        ACER: [
          "Acer Nitro 5",
          "Acer Predator Helios",
          "Aspire Series",
          "Swift Series",
        ],
        MSI: [
          "MSI Katana Series",
          "MSI Cyborg Series",
          "Modern Series",
          "Prestige Series",
          "MSI Raider Series",
        ],
        LENOVO: [
          "Legion Series",
          "Thinkbook Series",
          "Ideapad Series",
          "Thinkpad Series",
          "Yoga Series",
        ],
        DELL: [
          "Alienware Series",
          "G15 Series",
          "Inspiron Series",
          "Vostro Series",
          "Latitude Series",
          "XPS Series",
        ],
        "HP - Pavilion": [
          "HP Victus",
          "HP Omen",
          "HP Pavilion Gaming",
          "HP Spectre",
        ],
        "LG - Gram": ["LG Gram 14", "LG Gram 16", "LG Gram 17"],
      },
    },
    "Laptop AI": {
      items: [
        "Dưới 15 triệu",
        "Từ 15 đến 20 triệu",
        "Trên 20 triệu",
        "Tích hợp AI Copilot",
        "Chạy tốt mô hình AI",
        "Laptop cho AI Engineer",
      ],
    },
    "CPU Intel - AMD": {
      items: [
        "Intel Core i3",
        "Intel Core i5",
        "Intel Core i7",
        "Intel Core i9",
        "AMD Ryzen 3",
        "AMD Ryzen 5",
        "AMD Ryzen 7",
        "AMD Ryzen 9",
      ],
    },
    "Nhu cầu sử dụng": {
      items: [
        "Đồ họa - Studio",
        "Học sinh - Sinh viên",
        "Mỏng nhẹ cao cấp",
        "Lập trình viên",
        "Văn phòng - Hành chính",
        "Gaming chuyên nghiệp",
      ],
    },
    "Linh phụ kiện Laptop": {
      items: [
        "Ram laptop",
        "SSD laptop",
        "Ổ cứng di động",
        "Đế tản nhiệt",
        "Túi chống sốc",
        "Dock sạc",
        "Hub mở rộng",
      ],
    },
  };

  const handleClickCategory = (category) => {
    if (category === "Bàn phím") {
      navigate("/san-pham?category=keyboard");
    } else if (category === "SSD laptop") {
      navigate("/san-pham?category=ssd");
    } else if (category === "Tai Nghe") {
      navigate("/san-pham?category=headphone");
    } else if (category === "Đế tản nhiệt") {
      navigate("/san-pham?category=pccooling");
    } else if (category === "Chuột + Lót chuột") {
      navigate("/san-pham?category=mouse");
    } else if (category === "PC GVN") {
      navigate("/san-pham?category=pcgaming");
    } else {
      // Default behavior for other categories
      const el = document.getElementById(category);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    onClose?.();
  };

  const toggleCategory = (category) => {
    setExpandedCategory((prev) => (prev === category ? null : category));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setExpandedCategory(null);
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={containerRef}
      className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-xl p-6 w-[1100px] max-h-[450px] overflow-auto z-50 text-gray-900 text-lg flex"
    >
      {/* Sidebar Categories */}
      <ul className="w-1/3 space-y-3 border-r border-gray-300 pr-6">
        {Object.entries(categories).map(([category, data]) => {
          const hasSub = !!data.subcategories;
          const hasItems = data.items?.length > 0;
          const isExpandable = hasSub || hasItems;
          const isExpanded = expandedCategory === category;

          return (
            <li key={category}>
              <button
                onClick={() =>
                  isExpandable
                    ? toggleCategory(category)
                    : handleClickCategory(category)
                }
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition duration-200 hover:scale-105 font-semibold"
              >
                <span>{category}</span>
                {isExpandable &&
                  (isExpanded ? (
                    <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4 text-gray-600" />
                  ))}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Right Panel */}
      <div className="w-2/3 pl-6 overflow-auto max-h-[440px]">
        {expandedCategory && (
          <>
            {/* Subcategories (multi-column) */}
            {categories[expandedCategory].subcategories && (
              <div className="grid grid-cols-4 gap-8">
                {Object.entries(categories[expandedCategory].subcategories).map(
                  ([subCategory, items]) => (
                    <div key={subCategory}>
                      <h4 className="font-semibold mb-3">{subCategory}</h4>
                      <ul className="space-y-2">
                        {items.length > 0 ? (
                          items.map((item) => (
                            <li key={item}>
                              <button
                                onClick={() => handleClickCategory(item)}
                                className="w-full text-left text-base hover:text-red-600 transition duration-200 hover:scale-105"
                              >
                                {item}
                              </button>
                            </li>
                          ))
                        ) : (
                          <li className="italic text-gray-400 text-sm">
                            Chưa có mục nào
                          </li>
                        )}
                      </ul>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Flat list of items */}
            {!categories[expandedCategory].subcategories &&
              categories[expandedCategory].items && (
                <ul className="space-y-2">
                  {categories[expandedCategory].items.map((item) => (
                    <li key={item}>
                      <button
                        onClick={() => handleClickCategory(item)}
                        className="w-full text-left text-base hover:text-red-600 transition duration-200 hover:scale-105"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
          </>
        )}
      </div>
    </div>
  );
};

export default LaptopCategories;
