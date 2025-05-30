from enum import Enum
from pydantic import BaseModel
from typing import Optional, Dict, Any

class BankType(str, Enum):
    MBBANK = "mbbank"
    MOMO = "momo"

class QRResponse(BaseModel):
    success: bool
    qr_image_url: Optional[str] = None
    qr_image_base64: Optional[str] = None
    payment_link: Optional[str] = None
    mb_link: Optional[str] = None
    momo_uri: Optional[str] = None
    note: str
    amount: int
    bank_info: Dict[str, Any]

class HealthCheckResponse(BaseModel):
    status: str
    timestamp: str
    qr_sample: Optional[str] = None