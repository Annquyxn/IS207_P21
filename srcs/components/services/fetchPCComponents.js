// src/services/buildpc/fetchPCComponents.js

// Mock data để mô phỏng API
const mockComponents = [
  {
    id: 1,
    name: "CPU",
    iconUrl:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/3169cd3dab5620da0f9fd34581e2c0e28e8ef028",
    price: 0,
    specs: {
      socket: "LGA 1700",
      cores: 6,
      threads: 12,
    },
  },
  {
    id: 2,
    name: "Mainboard",
    iconUrl:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/fd87d3b3c496280bc5cc4bc0af23ca5dae951153",
    price: 0,
    specs: {
      chipset: "Intel B660",
      formFactor: "ATX",
    },
  },
  {
    id: 14,
    name: "Phần mềm",
    iconUrl:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/b2ad2316769bce32470d0fa4f6d992240eab944f",
    price: 0,
    category: "OS",
  },
];

// Hàm mock API call
const fetchPCComponents = async () => {
  try {
    // Giả lập delay API
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Giả lập response structure
    return {
      success: true,
      data: mockComponents,
      message: "Fetch components successfully",
    };
  } catch (error) {
    console.error("Error fetching components:", error);
    return {
      success: false,
      data: null,
      message: error.message || "Failed to fetch components",
    };
  }
};

export default fetchPCComponents;
