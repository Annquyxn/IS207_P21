import os
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

def register_fonts():
    font_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "fonts")
    
    fonts = {
        "NotoSans-Regular": "NotoSans-Regular.ttf",
        "NotoSans-Bold": "NotoSans-Bold.ttf"
    }
    
    for font_name, file_name in fonts.items():
        font_path = os.path.join(font_dir, file_name)
        
        if os.path.exists(font_path):
            try:
                pdfmetrics.registerFont(TTFont(font_name, font_path))
                print(f"Registered font: {font_name}")
            except Exception as e:
                print(f"Error registering font {font_name}: {str(e)}")
        else:
            print(f"Font file not found: {font_path}")
    
    try:
        if "NotoSans-Regular" in pdfmetrics.getRegisteredFontNames():
            pdfmetrics.registerFontFamily(
                'NotoSans',
                normal='NotoSans-Regular',
                bold='NotoSans-Bold'
            )
            print("Registered NotoSans font family")
    except Exception as e:
        print(f"Error registering font family: {str(e)}")

if __name__ == "__main__":
    register_fonts()