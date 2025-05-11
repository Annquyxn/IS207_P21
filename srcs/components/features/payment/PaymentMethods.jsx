function PaymentMethods({ paymentMethod, setPaymentMethod }) {
  const methods = [
    { id: "cod", label: "Thanh toán khi nhận hàng" },
    { id: "bank", label: "Thanh toán qua ngân hàng" },
    { id: "e-wallet", label: "Thanh toán qua ví điện tử" },
  ];

  return (
    <section className="border border-black p-5 mb-6">
      <h2 className="text-2xl font-bold mb-5">Phương thức thanh toán</h2>

      <div className="flex flex-col gap-5">
        {methods.map((method) => (
          <div key={method.id} className="flex items-center">
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
              className="flex items-center gap-3 cursor-pointer"
            >
              <span
                className={`w-4 h-4 rounded-full border border-black flex items-center justify-center ${
                  paymentMethod === method.id ? "bg-black" : "bg-white"
                }`}
              >
                {paymentMethod === method.id && (
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                )}
              </span>
              <span className="text-xl">{method.label}</span>
            </label>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PaymentMethods;
