from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from datetime import datetime
import os

def tao_hoa_don_pdf(ten_khach, dia_chi_khach, phone, danh_sach_sp, tong_cong=None, ten_file='hoa_don.pdf'):
    output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "output")
    os.makedirs(output_dir, exist_ok=True)
    
    file_path = os.path.join(output_dir, ten_file)
    
    c = canvas.Canvas(file_path, pagesize=A4)
    width, height = A4
    
    c.setFont("Helvetica-Bold", 18)
    c.drawCentredString(width/2, height - 2*cm, "HÓA ĐƠN BÁN HÀNG")
    
    c.setFont("Helvetica-Bold", 12)
    c.drawString(1*cm, height - 3*cm, "CÔNG TY TNHH EDUCATION PLATFORM")
    c.setFont("Helvetica", 10)
    c.drawString(1*cm, height - 3.5*cm, "Địa chỉ: 227 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh")
    c.drawString(1*cm, height - 4*cm, "Điện thoại: 0987654321")
    c.drawString(1*cm, height - 4.5*cm, "Email: contact@edu-platform.com")
    
    c.setFont("Helvetica-Bold", 10)
    c.drawString(width - 5*cm, height - 3*cm, f"Số hóa đơn: HD{datetime.now().strftime('%Y%m%d%H%M%S')}")
    c.drawString(width - 5*cm, height - 3.5*cm, f"Ngày: {datetime.now().strftime('%d/%m/%Y')}")
    c.drawString(width - 5*cm, height - 4*cm, f"Giờ: {datetime.now().strftime('%H:%M:%S')}")
    
    c.setFont("Helvetica-Bold", 11)
    c.drawString(1*cm, height - 6*cm, "THÔNG TIN KHÁCH HÀNG:")
    c.setFont("Helvetica", 10)
    c.drawString(1*cm, height - 6.5*cm, f"Họ tên: {ten_khach}")
    c.drawString(1*cm, height - 7*cm, f"Địa chỉ: {dia_chi_khach}")
    if phone:
        c.drawString(1*cm, height - 7.5*cm, f"Điện thoại: {phone}")
    
    c.setFont("Helvetica-Bold", 11)
    c.drawString(1*cm, height - 9*cm, "DANH SÁCH SẢN PHẨM:")
    
    c.setFont("Helvetica-Bold", 10)
    c.drawString(1*cm, height - 10*cm, "STT")
    c.drawString(2*cm, height - 10*cm, "Tên sản phẩm")
    c.drawString(10*cm, height - 10*cm, "Số lượng")
    c.drawString(12.5*cm, height - 10*cm, "Đơn vị")
    c.drawString(15*cm, height - 10*cm, "Đơn giá")
    c.drawString(18*cm, height - 10*cm, "Thành tiền")
    
    c.setStrokeColor(colors.black)
    c.line(1*cm, height - 10.3*cm, width - 1*cm, height - 10.3*cm)
    
    y_position = height - 11*cm
    total = 0
    
    c.setFont("Helvetica", 10)
    for i, sp in enumerate(danh_sach_sp, 1):
        thanh_tien = sp.get('so_luong', 1) * sp.get('don_gia', 0)
        total += thanh_tien
        
        c.drawString(1*cm, y_position, str(i))
        c.drawString(2*cm, y_position, sp.get('ten', 'Không có tên'))
        c.drawString(10*cm, y_position, str(sp.get('so_luong', 1)))
        c.drawString(12.5*cm, y_position, sp.get('dvt', 'Khóa'))
        c.drawString(15*cm, y_position, format_currency(sp.get('don_gia', 0)))
        c.drawString(18*cm, y_position, format_currency(thanh_tien))
        
        y_position -= 0.8*cm
        
        if y_position < 5*cm:
            c.showPage()
            c.setFont("Helvetica-Bold", 10)
            c.drawString(1*cm, height - 2*cm, "DANH SÁCH SẢN PHẨM (tiếp theo):")
            c.drawString(1*cm, height - 3*cm, "STT")
            c.drawString(2*cm, height - 3*cm, "Tên sản phẩm")
            c.drawString(10*cm, height - 3*cm, "Số lượng")
            c.drawString(12.5*cm, height - 3*cm, "Đơn vị")
            c.drawString(15*cm, height - 3*cm, "Đơn giá")
            c.drawString(18*cm, height - 3*cm, "Thành tiền")
            c.line(1*cm, height - 3.3*cm, width - 1*cm, height - 3.3*cm)
            y_position = height - 4*cm
            c.setFont("Helvetica", 10)
    
    c.line(1*cm, y_position - 0.3*cm, width - 1*cm, y_position - 0.3*cm)
    
    if tong_cong is None:
        tong_cong = total
    
    c.setFont("Helvetica-Bold", 10)
    c.drawString(15*cm, y_position - 1*cm, "Tổng cộng:")
    c.drawString(18*cm, y_position - 1*cm, format_currency(tong_cong))
    
    c.setFont("Helvetica", 10)
    c.drawString(1*cm, y_position - 3*cm, "Phương thức thanh toán: Chuyển khoản / Tiền mặt")
    c.drawString(1*cm, y_position - 4*cm, "Lưu ý: Hóa đơn điện tử sẽ được gửi qua email trong vòng 24h.")
    
    c.setFont("Helvetica-Bold", 10)
    c.drawString(2*cm, y_position - 7*cm, "Người mua hàng")
    c.drawString(width - 5*cm, y_position - 7*cm, "Người bán hàng")
    
    c.setFont("Helvetica-Oblique", 8)
    c.drawString(2*cm, y_position - 7.5*cm, "(Ký, ghi rõ họ tên)")
    c.drawString(width - 5*cm, y_position - 7.5*cm, "(Ký, ghi rõ họ tên)")
    
    c.save()
    
    return file_path

def format_currency(amount):
    if not isinstance(amount, (int, float)):
        try:
            amount = float(amount)
        except (ValueError, TypeError):
            amount = 0
    
    return f"{amount:,.0f} VND"