from fastapi import APIRouter, Query, Response
from typing import Optional
from ..schemas import QRResponse
from ..utils.qr_generator import generate_mb_qr, generate_qr_code_base64
from ..config import settings

router = APIRouter(prefix="/mb", tags=["MB Bank QR"])

def add_cors_headers(response: Response):
    """Thêm CORS headers vào response"""
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response

@router.get("/qr", response_model=QRResponse)
async def get_mb_qr(
    response: Response,
    amount: int = Query(1000000, description="Số tiền thanh toán (VND)"),
    order_id: Optional[str] = Query(None, description="ID đơn hàng")
):
    note = f"ThanhToan_{order_id}" if order_id else "ThanhToan_API"
    
    # Tạo URL hình ảnh QR từ VietQR API (tự động chọn cách xác thực phù hợp)
    qr_url = generate_mb_qr(amount, note)
    
    # Tạo link thanh toán MB Bank trực tiếp cho trường hợp khách hàng muốn truy cập trực tiếp
    mb_link = f"https://me.mbbank.com.vn/mbqr/transfer?account={settings.MB_ACCOUNT_NUMBER}&bank=MBBANK&amount={amount}&note={note}"
    
    # Tạo QR code dạng base64 từ link thanh toán (cho frontend hiển thị nếu cần)
    qr_base64 = generate_qr_code_base64(mb_link)
    
    # Thêm CORS headers
    add_cors_headers(response)
    
    return {
        "success": True,
        "qr_image_url": qr_url,
        "qr_image_base64": qr_base64,
        "payment_link": qr_url,
        "note": note,
        "amount": amount,
        "bank_info": {
            "bank_name": "MB Bank",
            "account_number": settings.MB_ACCOUNT_NUMBER,
            "account_name": settings.MB_ACCOUNT_NAME,
            "bin": settings.MB_BIN,
            "template": "KE2heNu"
        }
    }