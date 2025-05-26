# ChatBot API - Tư vấn sản phẩm thông minh

API trợ lý ảo tư vấn sản phẩm dựa trên dữ liệu từ GearVN, cung cấp khả năng tìm kiếm, so sánh và đề xuất sản phẩm máy tính, linh kiện công nghệ.

## Tính năng chính

1. **Tư vấn thông minh**: Phân tích câu hỏi người dùng và đề xuất sản phẩm phù hợp
2. **So sánh sản phẩm**: Phân tích chi tiết sự khác biệt giữa các sản phẩm
3. **Tìm kiếm theo tiêu chí**: Hỗ trợ lọc theo giá, hãng, loại sản phẩm
4. **Trích xuất thông số**: Tự động trích xuất thông số kỹ thuật từ mô tả sản phẩm
5. **Sản phẩm tương tự**: Gợi ý các sản phẩm tương tự dựa trên phân tích tương đồng
6. **Phân tích trực quan**: Trả về dữ liệu có cấu trúc để hiển thị trực quan

## Cài đặt

```bash
# Cài đặt các thư viện cần thiết
pip install -r requirements.txt

# Chạy server
python main.py
```

## API Endpoints

### 1. Tư vấn sản phẩm

```
GET/POST /direct-query?query=<câu_hỏi>&model=<tên_model>
```

Phản hồi trả về:
- Văn bản tư vấn
- Danh sách sản phẩm phù hợp
- Bảng so sánh (nếu là yêu cầu so sánh)
- Metadata: loại truy vấn, số sản phẩm, danh mục,...

### 2. So sánh sản phẩm

```
GET/POST /compare-products?product_ids=id1,id2,id3
```

Phản hồi trả về:
- Thông tin sản phẩm
- Bảng so sánh thông số kỹ thuật
- Đề xuất sản phẩm phù hợp nhất

### 3. Sản phẩm tương tự

```
GET /similar-products/{product_id}
```

Phản hồi trả về:
- Danh sách sản phẩm tương tự với sản phẩm chỉ định

### 4. Thống kê danh mục sản phẩm

```
GET /product-categories
```

Phản hồi trả về:
- Số lượng sản phẩm theo danh mục
- Phạm vi giá theo danh mục
- Thương hiệu phổ biến theo danh mục

## Ví dụ truy vấn

1. **Tìm sản phẩm cụ thể**:
   - "Tư vấn laptop gaming dưới 25 triệu"
   - "So sánh card màn hình RTX 3060 và RTX 3070"
   - "Tìm SSD có dung lượng 1TB giá rẻ"

2. **Yêu cầu tư vấn theo nhu cầu**:
   - "Laptop nào phù hợp cho thiết kế đồ họa?"
   - "Cần một bộ PC văn phòng giá rẻ"
   - "Tư vấn tai nghe gaming tốt nhất"

3. **So sánh sản phẩm**:
   - "So sánh laptop Asus và MSI"
   - "Nên chọn Intel hay AMD cho gaming?"
   - "Card màn hình nào tốt hơn giữa RTX 3060 và RTX 4060?"

## Lưu ý

- API sử dụng dữ liệu từ file `gearvn_products_transformed.csv`
- Cần thiết lập biến môi trường `GROQ_API_KEY` để sử dụng chức năng tư vấn dựa trên AI
- Phản hồi API được thiết kế để dễ dàng tích hợp vào giao diện trực quan 