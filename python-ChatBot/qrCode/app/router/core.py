from fastapi import APIRouter, Query, Request, Response
from typing import Optional
from ..schemas import QRResponse, BankType
from ..utils.qr_generator import generate_mb_qr, generate_momo_deep_link, generate_qr_code_base64
from ..config import settings

router = APIRouter(tags=["Core Endpoints"])

def add_cors_headers(response: Response):
    """Thêm CORS headers vào response"""
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response

@router.get("/generate", response_model=QRResponse)
async def generate_qr(
    request: Request,
    response: Response,
    amount: int = Query(1000000, description="Số tiền thanh toán (VND)"),
    bank_type: BankType = Query(BankType.MBBANK, description="Loại ngân hàng"),
    order_id: Optional[str] = Query(None, description="ID đơn hàng")
):
    note = f"ThanhToan_{order_id}" if order_id else "ThanhToan_API"
    
    # Log request để debug
    print(f"Request for QR code: bank={bank_type}, amount={amount}, order_id={order_id}")
    
    # Thêm CORS headers
    add_cors_headers(response)
    
    if bank_type == BankType.MBBANK:
        # Tạo URL QR từ VietQR API
        qr_url = generate_mb_qr(amount, note)
        
        # Link thanh toán MB Bank cho truy cập trực tiếp
        mb_link = f"https://me.mbbank.com.vn/mbqr/transfer?account={settings.MB_ACCOUNT_NUMBER}&bank=MBBANK&amount={amount}&note={note}"
        
        # QR code base64 dự phòng
        qr_base64 = generate_qr_code_base64(mb_link)
        
        return {
            "success": True,
            "qr_image_url": qr_url,
            "qr_image_base64": qr_base64,
            "payment_link": qr_url,
            "mb_link": mb_link,
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
    else:
        # MoMo deep link
        momo_uri = generate_momo_deep_link(amount, note)
        
        # QR code base64
        qr_base64 = generate_qr_code_base64(momo_uri)
        
        return {
            "success": True,
            "payment_link": momo_uri,
            "qr_image_base64": qr_base64,
            "momo_uri": momo_uri,
            "note": note,
            "amount": amount,
            "bank_info": {
                "provider": "MoMo",
                "phone_number": settings.MOMO_PHONE,
                "name": settings.MOMO_NAME
            }
        }

@router.get("/")
async def root(response: Response):
    add_cors_headers(response)
    return {
        "message": "VietQR & Momo Payment API",
        "version": settings.APP_VERSION
    }

@router.get("/health")
async def health_check(response: Response):
    add_cors_headers(response)
    return {
        "status": "healthy",
        "message": "QR Code Server is running properly",
        "timestamp": "2023-08-17T12:34:56.789Z"
    }