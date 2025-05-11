function PaymentButton({ onClick }) {
  return (
    <section className="border-t border-black pt-8 flex justify-center">
      <button
        onClick={onClick}
        className="w-[260px] h-[80px] bg-black text-white rounded-xl text-4xl flex items-center justify-center hover:bg-gray-800 transition-colors"
      >
        Thanh toán
      </button>
    </section>
  );
}

export default PaymentButton;
