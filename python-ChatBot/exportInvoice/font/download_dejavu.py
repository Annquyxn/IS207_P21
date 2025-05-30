import os
import requests
import zipfile
import shutil
from io import BytesIO

def download_and_extract_dejavu_fonts():
    fonts_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'fonts')
    os.makedirs(fonts_dir, exist_ok=True)

    dejavu_url = "https://sourceforge.net/projects/dejavu/files/dejavu/2.37/dejavu-fonts-ttf-2.37.zip"
    print(f"Downloading DejaVu fonts from {dejavu_url}...")

    response = requests.get(dejavu_url)
    if response.status_code == 200:
        with zipfile.ZipFile(BytesIO(response.content)) as z:
            for font_file in z.namelist():
                if font_file.endswith('.ttf') and any(name in font_file for name in ['DejaVuSans.ttf', 'DejaVuSans-Bold.ttf', 'DejaVuSans-Oblique.ttf']):
                    with open(os.path.join(fonts_dir, os.path.basename(font_file)), "wb") as target:
                        shutil.copyfileobj(z.open(font_file), target)
        return True
    return False
