from fastapi import FastAPI, Query, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import qrcode
import io
import base64
from datetime import datetime, timedelta
from typing import Optional
import logging

logging.basicConfig(level=logging.INFO, 
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

        img = qrcode.make(qr_url)
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        buffer.seek(0)
        img_base64 = base64.b64encode(buffer.read()).decode()

        response_data = {
            "qr_image_base64": img_base64,
            "mb_link": qr_url,
            "note": note,
            "amount": amount
        }
        
        logger.info(f"Successfully generated MBBank QR. Note: {note}")

        response = JSONResponse(content=response_data)
        response.headers["Cache-Control"] = "public, max-age=30"
        response.headers["Access-Control-Allow-Origin"] = "*" 
        return response
    except Exception as e:
        logger.error(f"Error generating MBBank QR: {e}")
        raise HTTPException(status_code=500, detail=str(e))

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

        img = qrcode.make(momo_uri)
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        buffer.seek(0)
        img_base64 = base64.b64encode(buffer.read()).decode()

        response_data = {
            "qr_image_base64": img_base64,
            "momo_uri": momo_uri,
            "note": note,
            "amount": amount
        }
        
        logger.info(f"Successfully generated Momo QR. Note: {note}")

        response = JSONResponse(content=response_data)
        response.headers["Cache-Control"] = "public, max-age=30"
        response.headers["Access-Control-Allow-Origin"] = "*"  # Additional CORS header
        return response
    except Exception as e:
        logger.error(f"Error generating Momo QR: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    logger.info("Root endpoint accessed")
    return {"message": "QR Code API is running", "status": "active", "version": "1.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}
