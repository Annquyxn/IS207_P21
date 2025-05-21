import React from "react";

// Helper function to format price in VND
const formatPrice = (price) => {
  if (typeof price === 'number') {
    return price.toLocaleString('vi-VN') + ' ₫';
  }
  return price;
};

// Helper function to generate product advice based on product details
const generateProductAdvice = (product) => {
  const name = product.name || "";
  const type = product.type || "";
  let advice = "";

  if (name.toLowerCase().includes("laptop")) {
    if (parseInt(product.price) > 25000000) {
      advice = "Đây là laptop cao cấp phù hợp cho công việc đòi hỏi hiệu năng mạnh, đồ họa chuyên nghiệp hoặc gaming ở mức cao.";
    } else if (parseInt(product.price) > 15000000) {
      advice = "Laptop này có cấu hình tốt, cân được hầu hết các nhu cầu làm việc và giải trí thông thường.";
    } else {
      advice = "Đây là laptop có giá tốt, phù hợp cho học tập và các công việc văn phòng cơ bản.";
    }
  } else if (type.toLowerCase().includes("card màn hình") || name.toLowerCase().includes("vga")) {
    if (parseInt(product.price) > 10000000) {
      advice = "Card đồ họa mạnh, phù hợp cho gaming ở độ phân giải cao hoặc làm việc với đồ họa nặng.";
    } else {
      advice = "Card đồ họa phù hợp cho nhu cầu chơi game ở mức trung bình và các ứng dụng đồ họa thông thường.";
    }
  } else if (name.toLowerCase().includes("pc") || type.toLowerCase().includes("pc")) {
    if (parseInt(product.price) > 30000000) {
      advice = "Cấu hình PC cao cấp, đáp ứng mọi nhu cầu từ gaming đến đồ họa chuyên nghiệp.";
    } else if (parseInt(product.price) > 15000000) {
      advice = "PC có hiệu năng mạnh, cân được hầu hết game và phần mềm hiện nay.";
    } else {
      advice = "PC giá tốt, phù hợp cho công việc văn phòng và giải trí thông thường.";
    }
  }

  return advice;
};

export function BotMessage({ text, products }) {
  return (
    <article className="flex gap-3 items-start mt-4">
      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm">
        B
      </div>
      <div className="bg-pink-100 rounded-2xl px-4 py-2 text-base font-sans leading-relaxed shadow-md max-w-[75%]">
        <p>{text}</p>
        
        {products && products.length > 0 && (
          <div className="mt-2">
            {products.map((product, index) => (
              <div key={index} className="border-t border-pink-200 pt-2 mt-2">
                {product.name && (
                  <p className="font-medium text-sm">{product.name}</p>
                )}
                {product.price && (
                  <p className="text-red-600 text-sm mt-1">
                    {formatPrice(product.price)}
                  </p>
                )}
                {product.type && (
                  <p className="text-gray-600 text-xs">Loại: {product.type}</p>
                )}
                {product.vendor && (
                  <p className="text-gray-600 text-xs">Hãng: {product.vendor}</p>
                )}
                
                {/* Product advice */}
                <p className="text-blue-600 text-xs mt-2 italic">
                  {generateProductAdvice(product)}
                </p>
                
                <div className="mt-2 flex items-center gap-2">
                  {product.link && (
                    <a 
                      href={product.link} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded transition-colors"
                    >
                      Xem chi tiết
                    </a>
                  )}
                </div>
                
                {product.image && (
                  <div className="mt-2">
                    <img 
                      src={product.image} 
                      alt={product.name || "Product"} 
                      className="w-full max-h-32 object-contain rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/150?text=No+Image";
                      }}
                    />
                  </div>
                )}
              </div>
            ))}

            <div className="mt-4 pt-3 border-t border-pink-200 text-sm">
              <p className="font-medium">Quý khách cần tư vấn thêm?</p>
              <p className="text-xs text-gray-600 mt-1">
                Em có thể giúp anh/chị so sánh các sản phẩm, tư vấn thêm về cấu hình hoặc tìm sản phẩm phù hợp hơn với nhu cầu của anh/chị.
              </p>
            </div>
          </div>
        )}
        
        {products && products.length > 0 && products[0].message && (
          <div className="mt-2 text-red-500">{products[0].message}</div>
        )}
      </div>
    </article>
  );
}

export function UserMessage({ text }) {
  return (
    <article className="flex justify-end mt-6">
      <div className="flex items-end gap-3 max-w-[75%]">
        <div className="bg-gray-200 px-4 py-2 rounded-2xl text-base font-sans leading-relaxed shadow">
          {text}
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-sm">
          U
        </div>
      </div>
    </article>
  );
}
