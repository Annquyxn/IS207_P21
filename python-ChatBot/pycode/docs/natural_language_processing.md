# Xử lý Câu hỏi Tự nhiên trong TechBot

Tài liệu này mô tả cách TechBot xử lý các câu hỏi tự nhiên từ người dùng để đưa ra câu trả lời và gợi ý sản phẩm phù hợp.

## Quy trình xử lý câu hỏi

1. **Phân tích câu hỏi**: Khi người dùng nhập câu hỏi, hệ thống sẽ phân tích để trích xuất các thông tin quan trọng:
   - Khoảng giá
   - Danh mục sản phẩm
   - Thương hiệu
   - Thông số kỹ thuật
   - Mục đích sử dụng

2. **Tìm kiếm sản phẩm phù hợp**: Dựa trên kết quả phân tích, hệ thống tìm kiếm các sản phẩm phù hợp trong cơ sở dữ liệu.

3. **Tạo câu trả lời**: Sử dụng AI (Groq API) để tạo câu trả lời dựa trên phân tích câu hỏi và các sản phẩm tìm được.

4. **Trả về kết quả**: Trả về câu trả lời cùng với danh sách sản phẩm phù hợp.

## Ví dụ câu hỏi tự nhiên

TechBot có thể xử lý nhiều loại câu hỏi tự nhiên khác nhau:

### Câu hỏi về khoảng giá

```
"Tôi muốn tìm laptop gaming dưới 25 triệu"
"Có laptop nào chơi game tốt trong khoảng 20-30 triệu không?"
"Gợi ý cho tôi một số bàn phím cơ giá rẻ dưới 2 triệu"
```

### Câu hỏi về thông số kỹ thuật

```
"Laptop nào có card đồ họa RTX 4060 tốt nhất hiện nay?"
"Tôi cần PC có CPU Intel Core i7 và RAM 32GB"
"Có màn hình gaming nào 27 inch, 144Hz giá tốt không?"
```

### Câu hỏi về mục đích sử dụng

```
"Laptop nào phù hợp cho thiết kế đồ họa dưới 30 triệu?"
"Gợi ý laptop văn phòng nhẹ, pin trâu"
"PC gaming tầm trung chơi được các game AAA hiện nay"
```

### Câu hỏi kết hợp nhiều yếu tố

```
"Tôi cần một laptop Asus có RTX 3050, màn hình 15 inch, giá dưới 25 triệu để chơi game"
"Gợi ý bàn phím cơ Logitech hoặc Akko, switch tactile, có đèn RGB"
"PC gaming tầm 40 triệu, chơi được game ở độ phân giải 2K"
```

## Cách trích xuất thông tin từ câu hỏi

### 1. Trích xuất khoảng giá

TechBot sử dụng các biểu thức chính quy (regex) để nhận diện các mẫu giá khác nhau:

- "dưới X triệu"
- "không quá X triệu"
- "tối đa X triệu"
- "khoảng X triệu"
- "từ X đến Y triệu"
- "X-Y triệu"
- "X triệu"

### 2. Trích xuất danh mục sản phẩm

TechBot nhận diện các từ khóa liên quan đến danh mục sản phẩm như:
- laptop, máy tính xách tay
- pc, máy tính bàn
- màn hình, monitor
- bàn phím, keyboard
- chuột, mouse
- tai nghe, headphone
- linh kiện, phụ kiện

### 3. Trích xuất thương hiệu

TechBot nhận diện các thương hiệu phổ biến như:
- Asus, ROG, TUF
- Acer, Predator, Nitro
- MSI
- Apple, Macbook
- Dell, Alienware
- HP, Omen
- Lenovo, Legion
- Logitech
- HyperX
- Akko
- Samsung
- LG

### 4. Trích xuất thông số kỹ thuật

TechBot nhận diện các từ khóa liên quan đến thông số kỹ thuật như:
- CPU: vi xử lý, bộ xử lý, processor, chip, ryzen, intel, core i
- RAM: bộ nhớ, memory, ddr4, ddr5
- Storage: ssd, hdd, ổ cứng, ổ đĩa, lưu trữ, nvme
- GPU: card đồ họa, vga, card màn hình, rtx, gtx, nvidia, amd
- Display: màn hình, display, screen, panel, ips, oled, inch, hz

### 5. Trích xuất mục đích sử dụng

TechBot nhận diện các từ khóa liên quan đến mục đích sử dụng như:
- Gaming: gaming, game, chơi game, fps, battle royale, moba
- Văn phòng: văn phòng, office, word, excel, powerpoint, làm việc
- Đồ họa: đồ họa, thiết kế, design, photoshop, illustrator, premiere
- Lập trình: lập trình, coding, programming, developer, code
- Học tập: học tập, sinh viên, student, học, nghiên cứu

## Cách cải thiện câu trả lời

Để cải thiện chất lượng câu trả lời, bạn có thể:

1. **Bổ sung dữ liệu sản phẩm**: Thêm nhiều sản phẩm với thông tin chi tiết vào file `products.json`.

2. **Mở rộng từ điển từ khóa**: Thêm các từ khóa vào các danh sách trong `query_processor.py`.

3. **Tinh chỉnh prompt AI**: Điều chỉnh prompt trong `ai_service.py` để AI đưa ra câu trả lời phù hợp hơn.

4. **Thêm các mẫu câu hỏi**: Phân tích và thêm các mẫu câu hỏi phổ biến để cải thiện khả năng nhận diện.

## Ví dụ phân tích câu hỏi

### Câu hỏi:
```
"Tôi muốn tìm laptop gaming Asus dưới 25 triệu, có card đồ họa tốt để chơi game"
```

### Kết quả phân tích:
```json
{
  "price_range": {
    "min": null,
    "max": 25000000
  },
  "categories": ["laptop gaming"],
  "brands": ["asus"],
  "specs": {
    "gpu": ["card đồ họa tốt"]
  },
  "purposes": ["gaming"],
  "original_query": "Tôi muốn tìm laptop gaming Asus dưới 25 triệu, có card đồ họa tốt để chơi game"
}
```

### Sản phẩm phù hợp:
- Laptop Gaming Asus TUF Gaming A15 FA507NU
- (Các sản phẩm khác phù hợp với tiêu chí)

### Câu trả lời AI:
```
Dựa trên yêu cầu của bạn về laptop gaming Asus dưới 25 triệu có card đồ họa tốt để chơi game, tôi xin giới thiệu Laptop Gaming Asus TUF Gaming A15 FA507NU với giá 23.990.000đ.

Đây là lựa chọn phù hợp vì:
1. Trang bị card đồ họa NVIDIA GeForce RTX 4050 6GB GDDR6, đủ mạnh để chơi tốt các game hiện nay
2. CPU AMD Ryzen 7 7735HS mạnh mẽ cho hiệu năng gaming và đa nhiệm tốt
3. RAM 16GB DDR5 4800MHz cho khả năng xử lý đa nhiệm mượt mà
4. Màn hình 15.6 inch FHD IPS 144Hz, mang lại trải nghiệm gaming mượt mà

Laptop này nằm trong tầm giá dưới 25 triệu như yêu cầu của bạn và đáp ứng tốt nhu cầu chơi game với card đồ họa RTX 4050 mới nhất.
``` 