from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import uuid
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm, mm
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
from datetime import datetime
import io
from fastapi.routing import APIRoute
from fastapi import Request, Response
import json
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Font configuration
fonts_path = os.path.join(os.path.dirname(__file__), 'fonts')
os.makedirs(fonts_path, exist_ok=True)

# Define brand colors
BRAND_COLOR = colors.HexColor('#ef4444')  # Red color
BRAND_COLOR_DARK = colors.HexColor('#b91c1c')  # Darker red
BRAND_COLOR_LIGHT = colors.HexColor('#fee2e2')  # Light red

# Define font variables
DEFAULT_FONT = 'Helvetica'  # Fallback
VIETNAMESE_FONT = None  # Will be set to a font that supports Vietnamese

# First try to download the Noto Sans font if it doesn't exist
notosans_regular = os.path.join(fonts_path, 'NotoSans-Regular.ttf')
notosans_bold = os.path.join(fonts_path, 'NotoSans-Bold.ttf')
notosans_viet = os.path.join(fonts_path, 'NotoSansVietnamese-Regular.ttf')
notosans_viet_bold = os.path.join(fonts_path, 'NotoSansVietnamese-Bold.ttf')

# Check if fonts need to be downloaded
if not (os.path.exists(notosans_regular) or os.path.exists(notosans_viet)):
    try:
        print("Downloading Noto Sans fonts...")
        from download_fonts import download_noto_sans_fonts
        download_noto_sans_fonts()
    except Exception as e:
        print(f"Error downloading Noto Sans fonts: {str(e)}")

# Register fonts
try:
    # First try NotoSansVietnamese which is specifically designed for Vietnamese
    if os.path.exists(notosans_viet):
        pdfmetrics.registerFont(TTFont('NotoSansVietnamese', notosans_viet))
        VIETNAMESE_FONT = 'NotoSansVietnamese'
        DEFAULT_FONT = 'NotoSansVietnamese'
        print(f"Registered NotoSansVietnamese font")
    
    if os.path.exists(notosans_viet_bold):
        pdfmetrics.registerFont(TTFont('NotoSansVietnamese-Bold', notosans_viet_bold))
        print(f"Registered NotoSansVietnamese Bold font")
    
    # Register regular NotoSans as fallback
    if VIETNAMESE_FONT is None and os.path.exists(notosans_regular):
        pdfmetrics.registerFont(TTFont('NotoSans', notosans_regular))
        VIETNAMESE_FONT = 'NotoSans'
        DEFAULT_FONT = 'NotoSans'
        print(f"Registered NotoSans Regular font")
    
    if os.path.exists(notosans_bold):
        pdfmetrics.registerFont(TTFont('NotoSans-Bold', notosans_bold))
        print(f"Registered NotoSans Bold font")
        
    # Register font families
    if VIETNAMESE_FONT == 'NotoSansVietnamese':
        pdfmetrics.registerFontFamily('NotoSansVietnamese',
                                     normal='NotoSansVietnamese',
                                     bold='NotoSansVietnamese-Bold')
        print("Registered NotoSansVietnamese font family")
    elif VIETNAMESE_FONT == 'NotoSans':
        pdfmetrics.registerFontFamily('NotoSans',
                                     normal='NotoSans',
                                     bold='NotoSans-Bold')
        print("Registered NotoSans font family")
    
    if VIETNAMESE_FONT:
        print(f"Using {VIETNAMESE_FONT} for PDF generation with Vietnamese support")
except Exception as e:
    print(f"Error registering fonts: {str(e)}. Using default Helvetica.")
    DEFAULT_FONT = 'Helvetica'

# Define data models
class SanPham(BaseModel):
    ten: str
    so_luong: int
    don_gia: int
    dvt: Optional[str] = "Khóa"

class HoaDonRequest(BaseModel):
    ten_khach: str
    dia_chi_khach: str
    phone: Optional[str] = None
    danh_sach_sp: List[SanPham]

# Create FastAPI app
app = FastAPI(title="Invoice Generator API")

# Create a directory for PDFs if it doesn't exist
os.makedirs("generated_pdfs", exist_ok=True)

# Configure CORS for frontend - this needs to be added AFTER creating the app
# but BEFORE adding routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use wildcard to simplify debugging
    allow_credentials=False,  # Changed to False to allow wildcard origins
    allow_methods=["*"],
    allow_headers=["*"],
)

def tao_hoa_don_pdf(ten_khach, dia_chi_khach, phone, danh_sach_sp, tong_cong, ten_file='hoa_don.pdf'):
    # Setup document with embedded fonts
    doc = SimpleDocTemplate(
        ten_file, 
        pagesize=A4,
        rightMargin=20*mm,
        leftMargin=20*mm,
        topMargin=20*mm,
        bottomMargin=20*mm
    )
    
    # Create custom styles with Vietnamese font
    styles = getSampleStyleSheet()
    
    # Define proper font name based on what's available
    bold_font = f"{DEFAULT_FONT}-Bold" if DEFAULT_FONT in ['NotoSans', 'NotoSansVietnamese'] else "Helvetica-Bold"
    
    styles.add(ParagraphStyle(
        name='InvoiceTitle',
        parent=styles['Title'],
        fontSize=18,
        spaceAfter=10*mm,
        textColor=BRAND_COLOR,
        fontName=bold_font
    ))
    styles.add(ParagraphStyle(
        name='CompanyName',
        fontSize=14,
        textColor=BRAND_COLOR,
        alignment=TA_LEFT,
        spaceAfter=2*mm,
        fontName=DEFAULT_FONT
    ))
    styles.add(ParagraphStyle(
        name='CompanyInfo',
        fontSize=9,
        textColor=colors.darkgrey,
        alignment=TA_LEFT,
        leading=12,
        fontName=DEFAULT_FONT
    ))
    styles.add(ParagraphStyle(
        name='CustomerInfo',
        fontSize=10,
        textColor=colors.black,
        spaceAfter=5*mm,
        fontName=DEFAULT_FONT
    ))
    styles.add(ParagraphStyle(
        name='InvoiceNumber',
        fontSize=10,
        alignment=TA_RIGHT,
        textColor=colors.grey,
        fontName=DEFAULT_FONT
    ))
    styles.add(ParagraphStyle(
        name='Total',
        fontSize=12,
        alignment=TA_RIGHT,
        textColor=BRAND_COLOR,
        fontName=bold_font
    ))
    styles.add(ParagraphStyle(
        name='Footer',
        fontSize=8,
        alignment=TA_CENTER,
        textColor=colors.grey,
        fontName=DEFAULT_FONT
    ))
    
    # Create the story list to hold elements
    elements = []
    
    # Header with logo and company info
    header_data = [
        [
            # Logo would go here if available
            Paragraph("<b>CÔNG TY TNHH EDUCATION</b>", styles["CompanyName"]),
        ],
        [
            "",
            Paragraph("Địa chỉ: 227 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh<br/>Email: contact@education.vn<br/>Hotline: 028.3835.4266", styles["CompanyInfo"])
        ]
    ]
    
    header_table = Table(header_data, colWidths=[2*cm, 15*cm])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    elements.append(header_table)
    
    # Add horizontal line
    elements.append(Spacer(1, 2*mm))
    elements.append(Table([[' ']], colWidths=[doc.width], rowHeights=[0.5*mm],
                         style=[('BACKGROUND', (0, 0), (-1, -1), BRAND_COLOR),
                               ('LINEABOVE', (0, 0), (-1, -1), 1, BRAND_COLOR)]))
    elements.append(Spacer(1, 5*mm))
    
    # Invoice title
    elements.append(Paragraph("<b>HÓA ĐƠN BÁN HÀNG</b>", styles['InvoiceTitle']))
    
    # Invoice details block
    now = datetime.now()
    invoice_details_data = [
        ["Số hóa đơn:", f"INV-{now.strftime('%Y%m%d')}-{str(uuid.uuid4())[:6].upper()}"],
        ["Ngày lập:", now.strftime("%d/%m/%Y %H:%M")],
        ["Hình thức:", "Thanh toán trực tuyến"],
    ]
    
    invoice_details = Table(invoice_details_data, colWidths=[3*cm, 5*cm])
    invoice_details.setStyle(TableStyle([
        ('FONT', (0, 0), (0, -1), bold_font),
        ('FONT', (1, 0), (1, -1), DEFAULT_FONT),
        ('TEXTCOLOR', (0, 0), (0, -1), BRAND_COLOR),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2*mm),
    ]))
    elements.append(invoice_details)
    elements.append(Spacer(1, 5*mm))
    
    # Customer information block
    elements.append(Paragraph("<b>THÔNG TIN KHÁCH HÀNG:</b>", styles['CustomerInfo']))
    customer_data = [
        ["Khách hàng:", ten_khach],
        ["Địa chỉ:", dia_chi_khach]
    ]
    
    if phone:  # Only add phone if available
        customer_data.append(["Số điện thoại:", phone])
    
    customer_table = Table(customer_data, colWidths=[3*cm, 13*cm])
    customer_table.setStyle(TableStyle([
        ('FONT', (0, 0), (0, -1), bold_font),
        ('FONT', (1, 0), (1, -1), DEFAULT_FONT),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2*mm),
    ]))
    elements.append(customer_table)
    elements.append(Spacer(1, 5*mm))
    
    # Products table header
    elements.append(Paragraph("<b>CHI TIẾT SẢN PHẨM:</b>", styles['CustomerInfo']))
    elements.append(Spacer(1, 2*mm))
    
    # Format the products table with improved styling
    data = [
        ["STT", "Tên sản phẩm", "ĐVT", "Số lượng", "Đơn giá (VNĐ)", "Thành tiền (VNĐ)"]
    ]

    for i, sp in enumerate(danh_sach_sp):
        thanh_tien = sp['so_luong'] * sp['don_gia']
        data.append([
            str(i+1),
            sp['ten'],
            sp.get('dvt', 'Khóa'),
            str(sp['so_luong']),
            f"{sp['don_gia']:,}",
            f"{thanh_tien:,}"
        ])
    
    # Add empty rows for spacing if less than a certain number of products
    while len(data) < 8:  # minimum 7 rows (1 header + 6 products)
        data.append(["", "", "", "", "", ""])
    
    # Add subtotal, shipping, tax, etc. rows
    data.append(["", "", "", "", "Tổng tiền sản phẩm:", f"{tong_cong:,}"])
    data.append(["", "", "", "", "Phí giao hàng:", "0"])  # Example shipping cost
    data.append(["", "", "", "", "Thuế VAT (10%):", f"{int(tong_cong * 0.1):,}"])  # Example tax
    data.append(["", "", "", "", "<b>TỔNG THANH TOÁN:</b>", f"<b>{int(tong_cong * 1.1):,}</b>"])  # Total with tax
    
    # Create the table with specific column widths
    table = Table(data, colWidths=[1*cm, 8*cm, 2*cm, 2*cm, 3*cm, 3.5*cm], repeatRows=1)
    
    # Apply styles to the table
    style = TableStyle([
        # Header row styling
        ('BACKGROUND', (0, 0), (-1, 0), BRAND_COLOR),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGNMENT', (0, 0), (-1, 0), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), bold_font),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 3*mm),
        ('TOPPADDING', (0, 0), (-1, 0), 3*mm),
        
        # Data rows
        ('GRID', (0, 0), (-1, -5), 0.5, colors.grey),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('FONTSIZE', (0, 1), (-1, -5), 9),
        ('BOTTOMPADDING', (0, 1), (-1, -5), 2*mm),
        ('TOPPADDING', (0, 1), (-1, -5), 2*mm),
        ('ALIGNMENT', (3, 1), (5, -1), 'RIGHT'),  # Align numbers to right
        ('FONTNAME', (0, 1), (-1, -1), DEFAULT_FONT),  # Set font for all data cells
        
        # Summary rows styling
        ('LINEABOVE', (4, -4), (-1, -4), 1, colors.grey),
        ('TOPPADDING', (0, -4), (-1, -1), 2*mm),
        ('BOTTOMPADDING', (0, -4), (-1, -1), 2*mm),
        ('ALIGNMENT', (0, -4), (3, -1), 'RIGHT'),
        ('FONTNAME', (4, -1), (-1, -1), bold_font),
        ('TEXTCOLOR', (4, -1), (-1, -1), BRAND_COLOR),
        ('FONTSIZE', (4, -1), (-1, -1), 10),
    ])
    
    table.setStyle(style)
    elements.append(table)
    
    # Add payment information and terms
    elements.append(Spacer(1, 8*mm))
    elements.append(Paragraph("<b>PHƯƠNG THỨC THANH TOÁN:</b>", styles['CustomerInfo']))
    
    payment_info = [
        ["Phương thức:", "Chuyển khoản ngân hàng"],
        ["Tên tài khoản:", "CÔNG TY TNHH EDUCATION"],
        ["Số tài khoản:", "0123456789"],
        ["Ngân hàng:", "Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)"],
        ["Nội dung:", f"Thanh toan hoa don {now.strftime('%Y%m%d')} - {ten_khach}"]
    ]
    
    payment_table = Table(payment_info, colWidths=[3*cm, 13*cm])
    payment_table.setStyle(TableStyle([
        ('FONT', (0, 0), (0, -1), bold_font),
        ('FONT', (1, 0), (1, -1), DEFAULT_FONT),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1.5*mm),
    ]))
    elements.append(payment_table)
    
    # Add signature sections
    elements.append(Spacer(1, 15*mm))
    signature_data = [
        ["Người mua hàng", "Người bán hàng"],
        ["(Ký và ghi rõ họ tên)", "(Ký và ghi rõ họ tên)"],
    ]
    
    signature_table = Table(signature_data, colWidths=[8*cm, 8*cm])
    signature_table.setStyle(TableStyle([
        ('ALIGNMENT', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), bold_font),
        ('FONTNAME', (0, 1), (-1, 1), DEFAULT_FONT),
        ('FONTSIZE', (0, 1), (-1, 1), 8),
        ('TEXTCOLOR', (0, 1), (-1, 1), colors.grey),
        ('TOPPADDING', (0, 0), (-1, -1), 1*mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1*mm),
    ]))
    elements.append(signature_table)
    
    # Add spacer for signature area
    elements.append(Spacer(1, 25*mm))
    
    # Add footer with terms and company info
    footer_text1 = "Xin chân thành cảm ơn Quý khách đã sử dụng dịch vụ của chúng tôi!"
    footer_text2 = "Hóa đơn này được tạo tự động và có giá trị kế toán."
    footer_text3 = "Mọi thắc mắc xin liên hệ: 028.3835.4266 hoặc email: hotro@education.vn"
    
    elements.append(Paragraph(footer_text1, styles['Footer']))
    elements.append(Paragraph(footer_text2, styles['Footer']))
    elements.append(Paragraph(footer_text3, styles['Footer']))
    
    # Build the PDF with encoding info
    doc.build(elements)
    print(f"✅ Đã tạo hóa đơn: {ten_file}")

# Create a function to clean up old PDFs after a certain time
def cleanup_old_pdfs():
    # Implement a cleanup mechanism if needed
    pass

@app.post("/generate-invoice/")
async def generate_invoice(
    invoice_data: HoaDonRequest, 
    background_tasks: BackgroundTasks,
    request: Request
):
    try:
        print(f"Received request to generate invoice for {invoice_data.ten_khach}")
        print(f"Request headers: {request.headers}")
        
        # Create a unique filename for the PDF
        unique_id = str(uuid.uuid4())
        pdf_filename = f"generated_pdfs/hoa_don_{unique_id}.pdf"
        
        # Convert Pydantic models to dictionary for the PDF function
        san_pham_list = []
        tong_tien = 0
        
        print(f"Processing {len(invoice_data.danh_sach_sp)} products")
        
        for sp in invoice_data.danh_sach_sp:
            # Debug: Print product information
            print(f"Product: {sp.ten}, Quantity: {sp.so_luong}, Price: {sp.don_gia}")
            
            # Make sure the product name is properly encoded
            ten_sp = sp.ten
            
            # Handle price that might be formatted as string
            don_gia = sp.don_gia
            if isinstance(don_gia, str):
                don_gia = int(don_gia.replace(',', '').replace('.', ''))
                
            # Create a clean dictionary for the invoice
            san_pham_dict = {
                'ten': ten_sp,
                'so_luong': sp.so_luong,
                'don_gia': don_gia,
                'dvt': sp.dvt if sp.dvt else "Khóa"
            }
            
            san_pham_list.append(san_pham_dict)
            tong_tien += sp.so_luong * don_gia
        
        # Generate the PDF
        tao_hoa_don_pdf(
            invoice_data.ten_khach,
            invoice_data.dia_chi_khach,
            invoice_data.phone,  # Pass the phone separately
            san_pham_list,
            tong_tien,
            pdf_filename
        )
        
        # Schedule cleanup in the background
        background_tasks.add_task(cleanup_old_pdfs)
        
        # Return the file for download with CORS headers
        response = FileResponse(
            path=pdf_filename, 
            filename=f"hoa_don_{datetime.now().strftime('%Y%m%d_%H%M')}.pdf", 
            media_type="application/pdf"
        )
        
        # Add CORS headers directly to the response
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Expose-Headers"] = "Content-Disposition, Content-Type"
        
        print(f"Successfully generated invoice: {pdf_filename}")
        return response
    except Exception as e:
        print(f"Error generating invoice: {str(e)}")
        error_response = {"error": str(e), "detail": f"Failed to generate invoice: {str(e)}"}
        return Response(
            content=json.dumps(error_response),
            status_code=500,
            media_type="application/json",
            headers={"Access-Control-Allow-Origin": "*"}
        )

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "invoice-generator"}

@app.options("/generate-invoice/")
async def preflight_generate_invoice(request: Request):
    # Handle OPTIONS preflight requests
    response = Response()
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Accept, X-Requested-With"
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
    