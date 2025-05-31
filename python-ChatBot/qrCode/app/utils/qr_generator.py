from urllib.parse import quote
import qrcode
import base64
import io
import requests
import json
from ..config import settings

def generate_mb_qr(amount: int, note: str) -> str:
    """
    Tạo URL cho QR code thanh toán MB Bank sử dụng VietQR API
    
    Tham số:
    - amount: Số tiền thanh toán (VND)
    - note: Nội dung thanh toán
    
    Trả về URL hình ảnh QR code từ VietQR hoặc URL dự phòng
    """
    # Sử dụng mẫu KE2heNu theo yêu cầu mới từ ảnh
    template = "KE2heNu"
    
    # Tạo URL trực tiếp (không cần xác thực)
    direct_url = (
        f"https://api.vietqr.io/image/{settings.MB_BIN}-{settings.MB_ACCOUNT_NUMBER}-{template}.jpg"
        f"?accountName={quote(settings.MB_ACCOUNT_NAME)}&amount={amount}&addInfo={quote(note)}"
    )
    
    # Nếu chưa có thông tin xác thực VietQR API, dùng phương thức URL trực tiếp
    if not settings.VIETQR_CLIENT_ID or not settings.VIETQR_API_KEY:
        # Sử dụng URL trực tiếp (không cần xác thực)
        return direct_url
    
    # Sử dụng API chính thức của VietQR (có xác thực)
    try:
        headers = {
            "x-client-id": settings.VIETQR_CLIENT_ID,
            "x-api-key": settings.VIETQR_API_KEY,
            "Content-Type": "application/json"
        }
        
        payload = {
            "accountNo": settings.MB_ACCOUNT_NUMBER,
            "accountName": settings.MB_ACCOUNT_NAME,
            "acqId": int(settings.MB_BIN),  # Chuyển sang integer
            "amount": amount,
            "addInfo": note,
            "format": "image/png",
            "template": template  # Sử dụng template KE2heNu
        }
        
        response = requests.post(
            "https://api.vietqr.io/v2/generate", 
            headers=headers, 
            json=payload
        )
        
        if response.status_code == 200:
            result = response.json()
            if "data" in result and "qrDataURL" in result["data"]:
                return result["data"]["qrDataURL"]
            else:
                print(f"VietQR API response missing data: {result}")
        else:
            print(f"VietQR API error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error calling VietQR API: {str(e)}")
    
    # Fallback về URL trực tiếp nếu có lỗi
    return direct_url

def generate_momo_deep_link(amount: int, note: str) -> str:
    """
    Tạo deep link cho thanh toán Momo
    
    Tham số:
    - amount: Số tiền thanh toán (VND)
    - note: Nội dung thanh toán
    """
    return (
        f"momo://?action=pay&amount={amount}"
        f"&receiver={settings.MOMO_PHONE}"
        f"&name={quote(settings.MOMO_NAME)}"
        f"&message={quote(note)}"
    )

def generate_qr_code_base64(content: str) -> str:
    """
    Tạo QR code từ nội dung và trả về dưới dạng base64
    
    Tham số:
    - content: Nội dung cần mã hóa thành QR code
    
    Trả về:
    - Chuỗi base64 của hình ảnh QR code (định dạng PNG)
    """
    try:
        img = qrcode.make(content)
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        buffer.seek(0)
        return base64.b64encode(buffer.read()).decode('utf-8')
    except Exception as e:
        print(f"Error generating QR code: {str(e)}")
        return None