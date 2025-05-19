import { useState } from 'react';
import { motion } from "framer-motion";
import { FiTrash2, FiHeart, FiMinus, FiPlus } from "react-icons/fi";

function CartItem({ item, onRemove, onUpdateQuantity }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "₫";
  };

  const handleQuantityChange = (amount) => {
    const newQuantity = Math.max(1, item.quantity + amount);
    if (onUpdateQuantity) onUpdateQuantity(item.id, newQuantity);
  };
  
  const calculateDiscount = () => {
    if (!item.originalPrice) return null;
    const original = item.originalPrice;
    const current = item.price;
    if (original > current) {
      const discount = Math.round(((original - current) / original) * 100);
      return discount;
    }
    return null;
  };

  const discount = calculateDiscount();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="flex gap-5 py-6 border-b hover:bg-gray-50 transition-colors rounded-lg p-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-24 h-24 flex-shrink-0">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={item.image}
          alt={item.name}
          className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
        />
        {discount && (
          <div className="absolute top-0 left-0 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-tl-lg rounded-br-lg">
            -{discount}%
          </div>
        )}
      </div>

      <div className="flex-grow">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium text-lg text-gray-800 line-clamp-2">{item.name}</h3>
            <p className="text-gray-500 text-xs mt-1">Mã SP: {item.sku}</p>
          </div>
          
          <motion.div 
            animate={{ opacity: isHovered ? 1 : 0 }} 
            initial={{ opacity: 0 }}
            className="flex gap-2"
          >
            <button 
              onClick={() => onRemove && onRemove(item.id)}
              className="p-1.5 rounded-full hover:bg-red-100 text-red-500 transition-colors"
              title="Xóa sản phẩm"
            >
              <FiTrash2 />
            </button>
            <button 
              className="p-1.5 rounded-full hover:bg-pink-100 text-pink-500 transition-colors"
              title="Thêm vào ưa thích"
            >
              <FiHeart />
            </button>
          </motion.div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleQuantityChange(-1)}
              disabled={item.quantity <= 1}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors 
                ${item.quantity <= 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-200'
                }`
              }
            >
              <FiMinus size={14} />
            </button>
            
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => onUpdateQuantity && onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
              className="w-12 h-8 text-center border rounded-md"
            />
            
            <button 
              onClick={() => handleQuantityChange(1)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <FiPlus size={14} />
            </button>
          </div>

          <div className="text-right">
            <div className="text-red-600 font-bold">
              {formatPrice(item.price * item.quantity)}
            </div>
            {item.originalPrice && (
              <div className="text-gray-400 text-xs line-through">
                {formatPrice(item.originalPrice * item.quantity)}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CartItem;
