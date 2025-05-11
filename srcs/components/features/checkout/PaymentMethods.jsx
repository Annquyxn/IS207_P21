function PaymentMethods({ selectedMethod, setSelectedMethod }) {
  const methods = [
    {
      id: "cod",
      name: "Thanh toán khi nhận hàng",
      icon: "cash-outline",
      description: "Bạn chỉ thanh toán khi nhận được hàng",
    },
    {
      id: "momo",
      name: "Ví MoMo",
      icon: "phone-portrait-outline",
      description: "Thanh toán qua ứng dụng MoMo",
    },
    {
      id: "bank",
      name: "Chuyển khoản ngân hàng",
      icon: "card-outline",
      description: "Chuyển khoản qua tài khoản ngân hàng",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mt-6">
      <h2 className="text-xl font-bold mb-6">Phương thức thanh toán</h2>

      <div className="space-y-4">
        {methods.map((method) => (
          <div
            key={method.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedMethod === method.id
                ? "border-red-500 bg-red-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedMethod(method.id)}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-2 rounded-full ${
                  selectedMethod === method.id
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <IonIcon name={method.icon} className="text-xl" />
              </div>

              <div className="flex-grow">
                <h3 className="font-medium">{method.name}</h3>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>

              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === method.id
                    ? "border-red-500 bg-red-500"
                    : "border-gray-300"
                }`}
              >
                {selectedMethod === method.id && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaymentMethods;
 