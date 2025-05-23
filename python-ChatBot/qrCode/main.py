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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
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

def generate_mbbank_qr(amount=1000000):
    """Generate an MBBank QR code with the specified amount"""
    stk = "0982685374"
    bank = "MBBANK"
    note = "ThanhToan_API"
    qr_url = f"https://me.mbbank.com.vn/mbqr/transfer?account={stk}&bank={bank}&amount={amount}&note={note}"
    return {
        "qr_image_base64": generate_qr_code(qr_url),
        "mb_link": qr_url,
        "note": note,
        "amount": amount
    }

def generate_momo_qr(amount=1000000):
    """Generate a Momo QR code with the specified amount"""
    phone = "0982685374"
    name = "DANG THIEN AN"
    note = "ThanhToan_API"
    momo_uri = f"momo://?action=pay&amount={amount}&receiver={phone}&name={name}&message={note}"
    return {
        "qr_image_base64": generate_qr_code(momo_uri),
        "momo_uri": momo_uri,
        "note": note,
        "amount": amount
    }

@app.get("/mbqr")
def get_mb_qr(amount: Optional[int] = Query(None)):
    """Get MBBank QR code with the specified amount"""
    try:
        # Use the provided amount or default to 1000000 if not specified
        payment_amount = amount if amount is not None else 1000000
        logger.info(f"Serving MBBank QR code with amount: {payment_amount}")
        response = JSONResponse(content=generate_mbbank_qr(payment_amount))
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response
    except Exception as e:
        logger.error(f"Error serving MBBank QR: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

@app.get("/momoqr")
def get_momo_qr(amount: Optional[int] = Query(None)):
    """Get Momo QR code with the specified amount"""
    try:
        # Use the provided amount or default to 1000000 if not specified
        payment_amount = amount if amount is not None else 1000000
        logger.info(f"Serving Momo QR code with amount: {payment_amount}")
        response = JSONResponse(content=generate_momo_qr(payment_amount))
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response
    except Exception as e:
        logger.error(f"Error serving Momo QR: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

@app.get("/health")
def health_check():
    """Health check endpoint"""
    try:
        # Just generate test QR codes to check functionality
        generate_mbbank_qr()
        generate_momo_qr()
        
        response = JSONResponse(content={
            "status": "healthy", 
            "timestamp": datetime.now().isoformat(),
            "qr_module": "working"
        })
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return JSONResponse(
            status_code=500,
            content={"status": "unhealthy", "error": str(e)}
        )

@app.get("/")
def read_root():
    """Root endpoint returning server status"""
    response = JSONResponse(content={
        "message": "QR Code API is running", 
        "status": "active", 
        "endpoints": {
            "mbqr": "/mbqr?amount=PRICE_IN_VND",
            "momoqr": "/momoqr?amount=PRICE_IN_VND",
            "health": "/health"
        }
    })
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response

@app.get("/favicon.ico")
async def favicon():
    """Handle favicon requests"""
    return Response(content=b"", media_type="image/x-icon")

if __name__ == "__main__":
    import uvicorn
    # Use 0.0.0.0 to allow connections from any IP
    host = "0.0.0.0"
    port = 8000
    
    logger.info(f"Starting QR Code API on {host}:{port}")
    uvicorn.run("main:app", host=host, port=port, reload=True)
