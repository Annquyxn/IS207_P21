import { FaArrowRight } from "react-icons/fa";

function EmptyCart() {
  return (
    <div className="max-w-4xl mx-auto text-center p-8 bg-white rounded-xl shadow-sm">
      <div className="text-3xl font-bold mb-6">
        Giỏ hàng của bạn đang trống!
      </div>
      <button className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
        <span>Mua hàng ngay</span>
        <FaArrowRight className="text-xl" />
      </button>
    </div>
  );
}

export default EmptyCart;
