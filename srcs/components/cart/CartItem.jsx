export default function CartItem({ item }) {
  return (
    <div className="flex gap-4 py-6 border-b">
      <img 
        src={item.image} 
        alt={item.name} 
        className="w-24 h-24 object-cover rounded-lg"
      />
      
      <div className="flex-grow">
        <h3 className="font-medium text-lg">{item.name}</h3>
        <p className="text-gray-500 text-sm">Mã SP: {item.sku}</p>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <button className="px-3 py-1 border rounded-lg">-</button>
            <span>{item.quantity}</span>
            <button className="px-3 py-1 border rounded-lg">+</button>
          </div>
          
          <div className="text-red-600 font-medium">
            {item.price.toLocaleString()}đ
          </div>
        </div>
      </div>
    </div>
  )
}