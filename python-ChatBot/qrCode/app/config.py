try:
    from pydantic_settings import BaseSettings
    
    class Settings(BaseSettings):
        APP_NAME: str = "VietQR & Momo Payment API"
        APP_DESCRIPTION: str = "API to generate payment QR codes"
        APP_VERSION: str = "2.0.0"
        
        # MB Bank config - BIN = 970422 (Mã của MB Bank trong hệ thống VietQR)
        MB_BIN: str = "970422"
        MB_ACCOUNT_NUMBER: str = "0982685374"
        MB_ACCOUNT_NAME: str = "DANG THIEN AN"
        
        # Momo config
        MOMO_PHONE: str = "0982685374"
        MOMO_NAME: str = "DANG THIEN AN"
        
        VIETQR_CLIENT_ID: str = "13131c60-3af0-4101-9ca7-41737ef2611e"  
        VIETQR_API_KEY: str = "19243164-1fb6-4142-92ab-8cb69e4c4ba9"   
        
except ImportError:
    from pydantic import BaseModel
    
    class Settings(BaseModel):
        APP_NAME: str = "VietQR & Momo Payment API"
        APP_DESCRIPTION: str = "API to generate payment QR codes"
        APP_VERSION: str = "2.0.0"
        
        # MB Bank config - BIN = 970422 (Mã của MB Bank trong hệ thống VietQR)
        MB_BIN: str = "970422"
        MB_ACCOUNT_NUMBER: str = "0982685374"
        MB_ACCOUNT_NAME: str = "DANG THIEN AN"
        
        # Momo config
        MOMO_PHONE: str = "0982685374"
        MOMO_NAME: str = "DANG THIEN AN"
        
        # VietQR API config (cần cập nhật từ tài khoản My VietQR)
        VIETQR_CLIENT_ID: str = ""  # Cập nhật Client ID từ My VietQR
        VIETQR_API_KEY: str = ""    # Cập nhật API Key từ My VietQR

settings = Settings()