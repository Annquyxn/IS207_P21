from fastapi import FastAPI, Query, HTTPException, Request
from fastapi.responses import JSONResponse, Response
from fastapi.middleware.cors import CORSMiddleware
import qrcode
import io
import base64
from typing import Optional
import logging
import os
import sys
import traceback
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, 
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI(
    title="QR Code Generator API",
    description="API để tạo QR code cho thanh toán MBBank và Momo",
    version="1.0.0",
)

# Add CORS middleware - allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],  # Expose all headers
)

def generate_qr_code(content):
    """Generate a QR code from content and return base64 encoded image"""
    try:
        img = qrcode.make(content)
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        buffer.seek(0)
        return base64.b64encode(buffer.read()).decode()
    except Exception as e:
        logger.error(f"Error generating QR code: {e}")
        logger.error(traceback.format_exc())
        raise RuntimeError(f"Failed to generate QR code: {str(e)}")

@app.get("/generate")
async def generate_qr_code_endpoint(
    amount: int = Query(1000000), 
    bankType: str = Query("mbbank"),
    order_id: Optional[str] = Query(None)
):
    """Generate QR code based on bank type and amount"""
    try:
        logger.info(f"Generating {bankType} QR code with amount: {amount}, order_id: {order_id}")
        
        note = f"ThanhToan_{order_id}" if order_id else "ThanhToan_API"
        
        if bankType.lower() == "mbbank":
            stk = "0982685374"
            bank = "MBBANK"
            qr_url = f"https://me.mbbank.com.vn/mbqr/transfer?account={stk}&bank={bank}&amount={amount}&note={note}"
            result = {
                "success": True,
                "qr_image_base64": generate_qr_code(qr_url),
                "mb_link": qr_url,
                "note": note,
                "amount": amount,
                "bank_info": {
                    "bank_name": "MB Bank",
                    "account_number": stk,
                    "account_name": "DANG THIEN AN",
                }
            }
        elif bankType.lower() == "momo":
            phone = "0982685374"
            name = "DANG THIEN AN"
            momo_uri = f"momo://?action=pay&amount={amount}&receiver={phone}&name={name}&message={note}"
            result = {
                "success": True,
                "qr_image_base64": generate_qr_code(momo_uri),
                "momo_uri": momo_uri,
                "note": note,
                "amount": amount,
                "bank_info": {
                    "provider": "MoMo",
                    "phone_number": phone,
                    "name": name,
                }
            }
        else:
            return JSONResponse(
                status_code=400,
                content={"success": False, "error": f"Unsupported bank type: {bankType}"}
            )
        
        return result
        
    except Exception as e:
        logger.error(f"Error generating QR code: {e}")
        logger.error(traceback.format_exc())
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )

@app.get("/health")
def health_check():
    """Health check endpoint"""
    try:
        # Just generate a test QR code to check functionality
        test_qr = generate_qr_code("Test QR code")
        
        return {
            "status": "healthy", 
            "timestamp": datetime.now().isoformat(),
            "qr_module": "working"
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return JSONResponse(
            status_code=500,
            content={"status": "unhealthy", "error": str(e)}
        )

@app.get("/")
def read_root():
    """Root endpoint returning server status"""
    return {
        "message": "QR Code API is running", 
        "status": "active", 
        "endpoints": {
            "generate": "/generate?amount=PRICE_IN_VND&bankType=mbbank&order_id=ORDER_ID",
            "health": "/health"
        }
    }

@app.get("/favicon.ico")
async def favicon():
    """Handle favicon requests"""
    return Response(content=b"", media_type="image/x-icon")

@app.get("/mbqr")
async def get_mb_qr(amount: Optional[int] = Query(None), order_id: Optional[str] = Query(None)):
    """Get MBBank QR code with the specified amount - compatible with old frontend"""
    try:
        # Use the provided amount or default to 1000000 if not specified
        payment_amount = amount if amount is not None else 1000000
        logger.info(f"Serving MBBank QR code with amount: {payment_amount}, order_id: {order_id}")
        
        note = f"ThanhToan_{order_id}" if order_id else "ThanhToan_API"
        stk = "0982685374"
        bank = "MBBANK"
        qr_url = f"https://me.mbbank.com.vn/mbqr/transfer?account={stk}&bank={bank}&amount={payment_amount}&note={note}"
        
        result = {
            "qr_image_base64": generate_qr_code(qr_url),
            "mb_link": qr_url,
            "note": note,
            "amount": payment_amount,
            "bank_info": {
                "bank_name": "MB Bank",
                "account_number": stk,
                "account_name": "DANG THIEN AN",
            }
        }
        
        return result
    except Exception as e:
        logger.error(f"Error serving MBBank QR: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

@app.get("/momoqr")
async def get_momo_qr(amount: Optional[int] = Query(None), order_id: Optional[str] = Query(None)):
    """Get Momo QR code with the specified amount - compatible with old frontend"""
    try:
        # Use the provided amount or default to 1000000 if not specified
        payment_amount = amount if amount is not None else 1000000
        logger.info(f"Serving Momo QR code with amount: {payment_amount}, order_id: {order_id}")
        
        note = f"ThanhToan_{order_id}" if order_id else "ThanhToan_API"
        phone = "0982685374"
        name = "DANG THIEN AN"
        momo_uri = f"momo://?action=pay&amount={payment_amount}&receiver={phone}&name={name}&message={note}"
        
        result = {
            "qr_image_base64": generate_qr_code(momo_uri),
            "momo_uri": momo_uri,
            "note": note,
            "amount": payment_amount
        }
        
        return result
    except Exception as e:
        logger.error(f"Error serving Momo QR: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

if __name__ == "__main__":
    import uvicorn
    # Use 0.0.0.0 to allow connections from any IP
    host = "0.0.0.0"
    port = 8000  # Use port 8000 to match frontend expectations
    
    logger.info(f"Starting QR Code API on {host}:{port}")
    uvicorn.run("main:app", host=host, port=port, reload=True) 