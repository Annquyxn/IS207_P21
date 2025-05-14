import {
  FaShoppingCart,
  FaFileAlt,
  FaMoneyBill,
  FaCheckCircle,
} from "react-icons/fa";

const iconComponents = [FaShoppingCart, FaFileAlt, FaMoneyBill, FaCheckCircle];

function CheckoutProgress({ currentStep }) {
  const steps = [
    { label: "Giỏ hàng" },
    { label: "Thông tin" },
    { label: "Thanh toán" },
    { label: "Hoàn tất" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <div className="flex justify-between relative">
        {steps.map((step, index) => {
          const Icon = iconComponents[index];
          return (
            <div key={index} className="flex flex-col items-center z-10">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center 
                ${
                  index <= currentStep
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <Icon className="text-2xl" />
              </div>
              <span
                className={`mt-2 text-sm ${
                  index <= currentStep ? "text-red-600" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
        <div className="absolute h-1 bg-gray-200 top-6 left-1/4 right-1/4" />
      </div>
    </div>
  );
}

export default CheckoutProgress;
