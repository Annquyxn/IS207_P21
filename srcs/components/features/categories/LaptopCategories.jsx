import { useState, useEffect, useRef } from "react";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/solid";

const LaptopCategories = ({ onClose }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const containerRef = useRef();

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
        ASUS: ["ASUS OLED Series", "Vivobook Series", "Zenbook Series"],
        ACER: ["Aspire Series", "Swift Series"],
        MSI: ["Modern Series", "Prestige Series"],
        LENOVO: [
          "Thinkbook Series",
          "Ideapad Series",
          "Thinkpad Series",
          "Yoga Series",
        ],
        DELL: [
          "Inspiron Series",
          "Vostro Series",
          "Latitude Series",
          "XPS Series",
        ],
        "HP - Pavilion": [],
        "LG - Gram": [],
      },
    },
    "Laptop AI": {
      items: ["Dưới 15 triệu", "Từ 15 đến 20 triệu", "Trên 20 triệu"],
    },
    "CPU Intel - AMD": {
      items: ["Intel Core i3", "Intel Core i5", "Intel Core i7", "AMD Ryzen"],
    },
    "Nhu cầu sử dụng": {
      items: ["Đồ họa - Studio", "Học sinh - Sinh viên", "Mỏng nhẹ cao cấp"],
    },
    "Linh phụ kiện Laptop": {
      items: ["Ram laptop", "SSD laptop", "Ổ cứng di động"],
    },
  };

  const handleClickCategory = (category) => {
    const el = document.getElementById(category);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (onClose) onClose();
  };

  const toggleCategory = (category) => {
    setExpandedCategory((prev) => (prev === category ? null : category));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setExpandedCategory(null);
        if (onClose) onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={containerRef}
      className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-xl p-6 w-[1200px] max-h-[600px] overflow-auto z-50 text-gray-900 font-normal text-lg flex"
    >
      <ul className="w-1/3 space-y-3 border-r border-gray-300 pr-6">
        {Object.entries(categories).map(([category, data]) => {
          const hasSub = data.subcategories || data.items?.length > 0;
          const isExpanded = expandedCategory === category;

          return (
            <li key={category}>
              <button
                onClick={() =>
                  hasSub
                    ? toggleCategory(category)
                    : handleClickCategory(category)
                }
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition-transform duration-200 ease-in-out hover:scale-105 font-semibold text-lg"
                type="button"
              >
                <span>{category}</span>
                {hasSub && (
                  <>
                    {isExpanded ? (
                      <ChevronDownIcon className="w-4 h-4 ml-2 text-gray-600" />
                    ) : (
                      <ChevronRightIcon className="w-4 h-4 ml-2 text-gray-600" />
                    )}
                  </>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="w-2/3 pl-6 overflow-auto max-h-[440px]">
        {expandedCategory && (
          <>
            {categories[expandedCategory].subcategories && (
              <div className="grid grid-cols-4 gap-8">
                {Object.entries(categories[expandedCategory].subcategories).map(
                  ([subCat, items]) => (
                    <div key={subCat}>
                      <h4 className="font-semibold mb-3 text-lg">{subCat}</h4>
                      <ul className="space-y-2">
                        {items.length > 0 ? (
                          items.map((item) => (
                            <li key={item}>
                              <button
                                onClick={() => handleClickCategory(item)}
                                className="text-left w-full hover:text-red-600 transition-transform duration-200 ease-in-out hover:scale-105 text-base"
                                type="button"
                              >
                                {item}
                              </button>
                            </li>
                          ))
                        ) : (
                          <li className="italic text-gray-400 text-base">
                            Chưa có mục nào
                          </li>
                        )}
                      </ul>
                    </div>
                  )
                )}
              </div>
            )}

            {categories[expandedCategory].items &&
              !categories[expandedCategory].subcategories && (
                <ul className="space-y-2">
                  {categories[expandedCategory].items.map((item) => (
                    <li key={item}>
                      <button
                        onClick={() => handleClickCategory(item)}
                        className="text-left w-full hover:text-red-600 transition-transform duration-200 ease-in-out hover:scale-105 text-base"
                        type="button"
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
