import React from 'react';

const ProductDetails = () => {
  return (
    <section className="mt-8">
      <h2 className="text-2xl mt-8">Thông tin sản phẩm</h2>
      <h3 className="text-lg mt-4 mb-2">Đánh giá chi tiết màn hình GIGABYTE G25F2 25" IPS 200Hz chuyên game</h3>
      <p className="leading-relaxed">
        Màn hình GIGABYTE G25F2 là một trong những sản phẩm nổi bật trong dòng màn hình gaming, được thiết kế đặc biệt cho các game thủ yêu cầu cao về chất lượng hình ảnh, tốc độ phản hồi và tính năng hỗ trợ chơi game. Với kích thước 25 inch và tấm nền IPS, sản phẩm này hứa hẹn mang đến những trải nghiệm tuyệt vời trong mỗi trận đấu. Dưới đây là đánh giá chi tiết về sản phẩm này.
      </p>

      <figure className="my-4">
        <img 
          src="https://placehold.co/600x400/333333/333333" 
          alt="GIGABYTE G25F2 Monitor" 
          className="w-full rounded-md"
        />
      </figure>

      <h3 className="text-lg mt-4 mb-2">Đánh giá chi tiết sản phẩm</h3>
      <p className="leading-relaxed">
        Màn hình GIGABYTE G25F2 không chỉ ấn tượng về thiết kế mà còn vượt trội trong hiệu suất. Với tần số quét lên đến 200Hz và thời gian phản hồi 1ms, sản phẩm này đáp ứng nhu cầu của các game thủ chuyên nghiệp, mang lại hình ảnh mượt mà và chính xác. Nhờ vào công nghệ tấm nền IPS, màu sắc trên màn hình G25F2 luôn sống động và chân thực, giúp người dùng có thể trải nghiệm hình ảnh rõ nét trong từng khoảnh khắc.
      </p>
    </section>
  );
};

export default ProductDetails;