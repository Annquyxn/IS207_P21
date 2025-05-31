from fastapi import APIRouter, Query, Response
from typing import Optional
from ..schemas import QRResponse
from ..utils.qr_generator import generate_momo_deep_link, generate_qr_code_base64
from ..config import settings

router = APIRouter(prefix="/momo", tags=["Momo QR"])

def add_cors_headers(response: Response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Max-Age"] = "3600"
    return response

@router.get("/qr", response_model=QRResponse)
async def get_momo_qr(
    response: Response,
    amount: int = Query(1000000, description="Số tiền thanh toán (VND)"),
    order_id: Optional[str] = Query(None, description="ID đơn hàng")
):
    note = f"ThanhToan_{order_id}" if order_id else "ThanhToan_API"
    
    momo_uri = generate_momo_deep_link(amount, note)
    
    qr_base64 = generate_qr_code_base64(momo_uri)
    
    add_cors_headers(response)
    
    return {
        "success": True,
        "qr_image_base64": qr_base64,
        "payment_link": momo_uri,
        "momo_uri": momo_uri,
        "note": note,
        "amount": amount,
        "bank_info": {
            "provider": "MoMo",
            "phone_number": settings.MOMO_PHONE,
            "name": settings.MOMO_NAME
        }
    }