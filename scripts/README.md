# Service Scripts for Education Platform

Folder này chứa các script để chạy các dịch vụ backend cho ứng dụng Education Platform.

## Các script có sẵn

1. **run_all_services.bat**: Chạy tất cả các dịch vụ (PDF Invoice và QR Code) trong các cửa sổ riêng biệt
2. **start_invoice_service.bat**: Chạy dịch vụ xuất hóa đơn PDF tại http://localhost:8000
3. **start_qr_service.bat**: Chạy dịch vụ tạo mã QR tại http://localhost:8001

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
```

## Cấu trúc dịch vụ

- **Dịch vụ xuất hóa đơn PDF**: `/python-ChatBot/exportInvoice`
  - API Endpoint: http://localhost:8000/generate-invoice/
  - Dùng để tạo hóa đơn PDF cho đơn hàng

- **Dịch vụ tạo mã QR**: `/python-ChatBot/qrCode`
  - API Endpoint: http://localhost:8001/generate
  - Dùng để tạo mã QR cho thanh toán 