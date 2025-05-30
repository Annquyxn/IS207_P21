from fastapi import APIRouter, BackgroundTasks, Request, HTTPException
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel
from datetime import datetime
import os, uuid, json
from typing import List, Optional

from invoice.pdf_generator import tao_hoa_don_pdf

router = APIRouter()

class SanPham(BaseModel):
    ten: str
    so_luong: int
    don_gia: int
    dvt: str = "Khóa"

class HoaDonRequest(BaseModel):
    ten_khach: str
    dia_chi_khach: str
    phone: Optional[str] = None
    danh_sach_sp: List[SanPham]

@router.post("/generate-invoice/")
async def generate_invoice(invoice_data: HoaDonRequest):
    try:
        invoice_filename = f"hoa_don_{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:8]}.pdf"
        
        tong_cong = sum(sp.don_gia * sp.so_luong for sp in invoice_data.danh_sach_sp)
        
        danh_sach_sp = [
            {
                "ten": sp.ten,
                "so_luong": sp.so_luong,
                "don_gia": sp.don_gia,
                "dvt": sp.dvt
            } for sp in invoice_data.danh_sach_sp
        ]
        
        pdf_path = tao_hoa_don_pdf(
            ten_khach=invoice_data.ten_khach,
            dia_chi_khach=invoice_data.dia_chi_khach,
            phone=invoice_data.phone,
            danh_sach_sp=danh_sach_sp,
            tong_cong=tong_cong,
            ten_file=invoice_filename
        )
        
        return FileResponse(
            path=pdf_path,
            filename=invoice_filename,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={invoice_filename}"}
        )
    
    except Exception as e:
        print(f"Error generating invoice: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Không thể tạo hóa đơn: {str(e)}")

@router.get("/test-invoice/")
async def test_invoice():
    try:
        test_data = HoaDonRequest(
            ten_khach="Khách Hàng Test",
            dia_chi_khach="227 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh",
            phone="0987654321",
            danh_sach_sp=[
                SanPham(ten="Khóa học Python", so_luong=1, don_gia=1500000),
                SanPham(ten="Khóa học JavaScript", so_luong=2, don_gia=1200000),
                SanPham(ten="Khóa học React", so_luong=1, don_gia=2000000)
            ]
        )
        
        return await generate_invoice(test_data)
    
    except Exception as e:
        print(f"Error in test invoice: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Không thể tạo hóa đơn mẫu: {str(e)}")
