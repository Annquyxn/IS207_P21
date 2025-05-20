from fastapi import FastAPI, Query, HTTPException, Request
from fastapi.responses import JSONResponse, Response
from fastapi.middleware.cors import CORSMiddleware
import qrcode
import io
import base64
from datetime import datetime, timedelta
from typing import Optional
import logging
import os
import sys
import traceback

logging.basicConfig(level=logging.INFO, 
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI(
    title="QR Code Generator API",
    description="API để tạo QR code cho thanh toán MBBank và Momo",
    version="1.0.0",
)

# Add CORS middleware with more permissive configuration
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:8080",
    "http://127.0.0.1",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8080",
    # Add any other origins that need to access this API
    "*"  # Allow all origins (remove in production)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["Content-Type", "X-Total-Count"],
    max_age=86400,  # Cache preflight requests for 24 hours
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    logger.error(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={
            "message": "Internal server error",
            "error": str(exc),
            "path": str(request.url),
            "timestamp": datetime.now().isoformat()
        }
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

@app.get("/mbqr")
def generate_mb_qr(amount: Optional[int] = Query(100000), 
                   order_id: Optional[str] = Query(None)):
    try:
        logger.info(f"Generating MBBank QR code. Amount: {amount}, Order ID: {order_id}")
        stk = "0982685374"
        bank = "MBBANK"
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        note = f"ThanhToan_{order_id or timestamp}"

        qr_url = f"https://me.mbbank.com.vn/mbqr/transfer?account={stk}&bank={bank}&amount={amount}&note={note}"

        # Generate QR code
        img_base64 = generate_qr_code(qr_url)

        response_data = {
            "qr_image_base64": img_base64,
            "mb_link": qr_url,
            "note": note,
            "amount": amount
        }
        
        logger.info(f"Successfully generated MBBank QR. Note: {note}")

        return set_cors_headers(response_data)
    except Exception as e:
        logger.error(f"Error generating MBBank QR: {e}")
        logger.error(traceback.format_exc())
        return set_cors_headers({
            "error": str(e),
            "message": "Không thể tạo mã QR MBBank",
            "note": note if 'note' in locals() else None,
            "timestamp": datetime.now().isoformat()
        }, status_code=500)

@app.get("/momoqr")
def generate_momo_qr(amount: Optional[int] = Query(100000),
                    order_id: Optional[str] = Query(None)):
    try:
        logger.info(f"Generating Momo QR code. Amount: {amount}, Order ID: {order_id}")
        phone = "0982685374"
        name = "DANG THIEN AN"
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        note = f"ThanhToan_{order_id or timestamp}"

        momo_uri = f"momo://?action=pay&amount={amount}&receiver={phone}&name={name}&message={note}"

        # Generate QR code
        img_base64 = generate_qr_code(momo_uri)

        response_data = {
            "qr_image_base64": img_base64,
            "momo_uri": momo_uri,
            "note": note,
            "amount": amount
        }
        
        logger.info(f"Successfully generated Momo QR. Note: {note}")

        return set_cors_headers(response_data)
    except Exception as e:
        logger.error(f"Error generating Momo QR: {e}")
        logger.error(traceback.format_exc())
        return set_cors_headers({
            "error": str(e),
            "message": "Không thể tạo mã QR Momo",
            "note": note if 'note' in locals() else None,
            "timestamp": datetime.now().isoformat()
        }, status_code=500)

# Helper function to ensure CORS headers are set consistently
def set_cors_headers(content, status_code=200):
    response = JSONResponse(content=content, status_code=status_code)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Cache-Control"] = "no-cache, max-age=30"
    return response

@app.get("/")
def read_root():
    """Root endpoint returning server status"""
    logger.info("Root endpoint accessed")
    return set_cors_headers({
        "message": "QR Code API is running", 
        "status": "active", 
        "version": "1.0",
        "endpoints": {
            "mbqr": "/mbqr?amount=1000000&order_id=ORD123456",
            "momoqr": "/momoqr?amount=1000000&order_id=ORD123456",
            "health": "/health"
        },
        "timestamp": datetime.now().isoformat()
    })

@app.get("/health")
def health_check():
    """Health check endpoint"""
    try:
        # Also check if QR code generation works
        test_qr = generate_qr_code("test")
        
        return set_cors_headers({
            "status": "healthy", 
            "timestamp": datetime.now().isoformat(),
            "python_version": sys.version,
            "qr_module": "working",
            "server": "ok"
        })
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        logger.error(traceback.format_exc())
        return set_cors_headers({
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }, status_code=500)

@app.options("/{path:path}")
async def options_route(request: Request, path: str):
    """Handle OPTIONS requests for CORS preflight"""
    return set_cors_headers({})

@app.get("/favicon.ico")
async def get_favicon():
    """Endpoint to handle favicon requests from browsers to prevent 405 errors in logs"""
    return Response(content=b"", media_type="image/x-icon")

if __name__ == "__main__":
    import uvicorn
    # Allow overriding host and port via environment variables
    host = os.environ.get("QR_API_HOST", "0.0.0.0")
    port = int(os.environ.get("QR_API_PORT", "8000"))
    
    logger.info(f"Starting QR Code API on {host}:{port}")
    # Use this to run directly with Python
    uvicorn.run("main:app", host=host, port=port, reload=True)
