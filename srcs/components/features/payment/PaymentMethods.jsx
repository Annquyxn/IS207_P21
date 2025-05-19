import { FaCreditCard, FaMoneyBillWave, FaWallet } from 'react-icons/fa';

function PaymentMethods({ paymentMethod, setPaymentMethod }) {
  const methods = [
    { 
      id: "cod", 
      label: "Thanh toán khi nhận hàng", 
      icon: <FaMoneyBillWave className="text-2xl text-green-600" />,
      description: "Thanh toán bằng tiền mặt khi nhận hàng tại địa chỉ của bạn."
    },
    { 
      id: "bank", 
      label: "Thanh toán qua ngân hàng", 
      icon: <FaCreditCard className="text-2xl text-blue-600" />,
      description: "Chuyển khoản qua tài khoản ngân hàng của chúng tôi."
    },
    { 
      id: "e-wallet", 
      label: "Thanh toán qua ví điện tử", 
      icon: <FaWallet className="text-2xl text-purple-600" />,
      description: "Sử dụng các ví điện tử phổ biến như Momo, ZaloPay..."
    },
  ];

  return (
    <section className="bg-white rounded-2xl shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Phương thức thanh toán</h2>

      <div className="flex flex-col gap-4">
        {methods.map((method) => (
          <div 
            key={method.id} 
            className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
              paymentMethod === method.id 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => setPaymentMethod(method.id)}
          >
            <input
              type="radio"
              id={method.id}
              name="payment-method"
              checked={paymentMethod === method.id}
              onChange={() => setPaymentMethod(method.id)}
              className="hidden"
            />
            <label
              htmlFor={method.id}
              className="flex items-center gap-4 cursor-pointer w-full"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                {method.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium text-lg text-gray-800">{method.label}</p>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === method.id 
                    ? "border-blue-500 bg-blue-500" 
                    : "border-gray-300"
                }`}
              >
                {paymentMethod === method.id && (
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                )}
              </div>
            </label>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PaymentMethods;
