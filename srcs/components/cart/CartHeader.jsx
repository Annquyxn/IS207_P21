import { ShoppingCartIcon } from "@heroicons/react/outline";

function CartHeader({ count }) {
  return (
    <header className="flex items-center gap-3 py-4 border-b border-gray-200">
      <ShoppingCartIcon className="w-6 h-6 text-gray-600" />
      <h1 className="text-lg font-medium text-gray-800">
        Giỏ hàng của bạn{" "}
        <span className="text-gray-500">({count} sản phẩm)</span>
      </h1>
    </header>
  );
}

export default CartHeader;
