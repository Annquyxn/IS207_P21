# Service Scripts for Education Platform

Folder này chứa các script để chạy các dịch vụ backend cho ứng dụng Education Platform.

## Các script mới

### `run_all_backends.bat`
- **Mô tả:** Khởi động cả ba dịch vụ backend: ChatBot, QR Code và Invoice API
- **Cách sử dụng:** Double click để chạy hoặc thực thi từ command prompt
- **Cổng:**
  - ChatBot API: http://localhost:8000
  - QR Code API: http://localhost:8001
  - Invoice API: http://localhost:8002

### `stop_all_backends.bat`
- **Mô tả:** Dừng tất cả các dịch vụ backend đang chạy
- **Cách sử dụng:** Chạy khi bạn muốn dừng tất cả các dịch vụ

### `test_all_backends.bat`
- **Mô tả:** Kiểm tra xem tất cả các dịch vụ backend có đang chạy đúng không
- **Cách sử dụng:** Chạy sau khi khởi động các dịch vụ để xác nhận chúng đang hoạt động
- **Yêu cầu:** Cần có curl được cài đặt

### `check_all_backends_axios.html`
- **Mô tả:** Trang web để kiểm tra kết nối axios đến tất cả các dịch vụ backend
- **Cách sử dụng:** Mở trong trình duyệt sau khi đã khởi động các dịch vụ

### `run_chatbot_qr_services.bat`
- **Mô tả:** Khởi động cả ChatBot API và QR Code API trên các cổng khác nhau
- **Cách sử dụng:** Double click để chạy hoặc thực thi từ command prompt
- **Cổng:**
  - ChatBot API: http://localhost:8000
  - QR Code API: http://localhost:8001

### `stop_chatbot_qr_services.bat`
- **Mô tả:** Dừng các dịch vụ ChatBot và QR Code API đang chạy
- **Cách sử dụng:** Chạy khi bạn muốn dừng các dịch vụ

### `test_chatbot_qr_services.bat`
- **Mô tả:** Kiểm tra xem các dịch vụ ChatBot và QR Code API có đang chạy đúng không
- **Cách sử dụng:** Chạy sau khi khởi động các dịch vụ để xác nhận chúng đang hoạt động
- **Yêu cầu:** Cần có curl được cài đặt

## Các script có sẵn

1. **run_all_services.bat**: Chạy tất cả các dịch vụ (PDF Invoice và QR Code) trong các cửa sổ riêng biệt
2. **start_invoice_service.bat**: Chạy dịch vụ xuất hóa đơn PDF tại http://localhost:8002
3. **start_qr_service.bat**: Chạy dịch vụ tạo mã QR tại http://localhost:8003
4. **start_chatbot_service.bat**: Chạy dịch vụ ChatBot tại http://localhost:8000

## Các lệnh NPM đã được cấu hình

Từ thư mục gốc của dự án, bạn có thể chạy các lệnh sau:

```bash
# Chạy ứng dụng frontend (Vite) và tất cả các dịch vụ cùng một lúc
npm run server

# Chỉ chạy tất cả các dịch vụ backend
npm run services

# Chạy riêng dịch vụ xuất hóa đơn PDF
npm run service:invoice

# Chạy riêng dịch vụ tạo mã QR
npm run service:qrcode

# Chạy cả ChatBot và QR Code API
npm run service:chatbot-qr

# Chạy tất cả các dịch vụ backend (ChatBot, QR Code, và Invoice)
npm run services:all-backends

# Dừng tất cả các dịch vụ backend
npm run services:stop-all

# Kiểm tra tất cả các dịch vụ backend
npm run services:test-all

# Chạy frontend và tất cả các dịch vụ backend
npm run server:all-backends
```

## Cấu trúc dịch vụ

- **Dịch vụ ChatBot**: `/python-ChatBot/pycode`
  - API Endpoint: http://localhost:8000/test
  - Dùng để cung cấp tính năng trò chuyện AI và tư vấn sản phẩm

- **Dịch vụ xuất hóa đơn PDF**: `/python-ChatBot/exportInvoice`
  - API Endpoint: http://localhost:8002/generate-invoice/
  - Dùng để tạo hóa đơn PDF cho đơn hàng

- **Dịch vụ tạo mã QR**: `/python-ChatBot/qrCode`
  - API Endpoint chính: http://localhost:8001/generate (cổng mới)
  - API Endpoint cũ: http://localhost:8003/generate
  - Dùng để tạo mã QR cho thanh toán 

## Chạy tất cả các dịch vụ cùng lúc với ChatBot

Để khởi động tất cả các dịch vụ (gồm ChatBot, Invoice và QR Code) với cấu hình đúng:

```
IS207_P21/scripts/run_all_backends.bat
```

hoặc

```
npm run services:all-backends
``` 