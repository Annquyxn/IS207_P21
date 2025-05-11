function CheckoutProgress({ currentStep }) {
  const steps = [
    { icon: "cart", label: "Giỏ hàng" },
    { icon: "document", label: "Thông tin" },
    { icon: "cash", label: "Thanh toán" },
    { icon: "checkmark", label: "Hoàn tất" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <div className="flex justify-between relative">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center z-10">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center 
              ${
                index <= currentStep
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <IonIcon name={step.icon} className="text-2xl" />
            </div>
            <span
              className={`mt-2 text-sm ${
                index <= currentStep ? "text-red-600" : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
        <div className="absolute h-1 bg-gray-200 top-6 left-1/4 right-1/4" />
      </div>
    </div>
  );
}

export default CheckoutProgress;
