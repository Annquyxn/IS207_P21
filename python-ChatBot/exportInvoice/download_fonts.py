import os
import requests
import zipfile
import shutil
from io import BytesIO
import urllib.request

def download_and_extract_dejavu_fonts():
    """Download and extract DejaVu fonts for Vietnamese text support"""
    fonts_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fonts')
    os.makedirs(fonts_dir, exist_ok=True)
    
    # DejaVu fonts URL 
    dejavu_url = "https://sourceforge.net/projects/dejavu/files/dejavu/2.37/dejavu-fonts-ttf-2.37.zip"
    
    print(f"Downloading DejaVu fonts from {dejavu_url}...")
    response = requests.get(dejavu_url)
    
    if response.status_code == 200:
        print("Download successful, extracting fonts...")
        with zipfile.ZipFile(BytesIO(response.content)) as z:
            # Extract only the files we need
            for font_file in z.namelist():
                if font_file.endswith(('.ttf', '.TTF')) and any(name in font_file for name in ['DejaVuSans.ttf', 'DejaVuSans-Bold.ttf', 'DejaVuSans-Oblique.ttf']):
                    # Extract and rename to remove the directory structure
                    source = z.open(font_file)
                    target_path = os.path.join(fonts_dir, os.path.basename(font_file))
                    with open(target_path, "wb") as target:
                        shutil.copyfileobj(source, target)
                    print(f"Extracted {os.path.basename(font_file)}")
        
        print("Fonts extraction complete!")
        return True
    else:
        print(f"Failed to download fonts. Status code: {response.status_code}")
        return False

def download_noto_sans_fonts():
    """Download Google Noto Sans fonts with Vietnamese language support"""
    fonts_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fonts')
    os.makedirs(fonts_dir, exist_ok=True)
    
    # NotoSans Vietnamese font files
    notosans_url = "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf"
    notosans_bold_url = "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSans/NotoSans-Bold.ttf"
    
    # Download NotoSans Regular
    target_path = os.path.join(fonts_dir, "NotoSans-Regular.ttf")
    if os.path.exists(target_path):
        print(f"NotoSans-Regular.ttf already exists, skipping download.")
    else:
        try:
            print(f"Downloading NotoSans-Regular.ttf...")
            urllib.request.urlretrieve(notosans_url, target_path)
            print(f"Downloaded NotoSans-Regular.ttf successfully")
        except Exception as e:
            print(f"Error downloading NotoSans-Regular.ttf: {str(e)}")
    
    # Download NotoSans Bold
    target_path = os.path.join(fonts_dir, "NotoSans-Bold.ttf")
    if os.path.exists(target_path):
        print(f"NotoSans-Bold.ttf already exists, skipping download.")
    else:
        try:
            print(f"Downloading NotoSans-Bold.ttf...")
            urllib.request.urlretrieve(notosans_bold_url, target_path)
            print(f"Downloaded NotoSans-Bold.ttf successfully")
        except Exception as e:
            print(f"Error downloading NotoSans-Bold.ttf: {str(e)}")
            
    # Download Noto Sans Vietnamese specifically
    notosans_viet_url = "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/unhinted/ttf/NotoSans/NotoSans-Regular.ttf"
    notosans_viet_bold_url = "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/unhinted/ttf/NotoSans/NotoSans-Bold.ttf"
    
    target_path = os.path.join(fonts_dir, "NotoSansVietnamese-Regular.ttf")
    if os.path.exists(target_path):
        print(f"NotoSansVietnamese-Regular.ttf already exists, skipping download.")
    else:
        try:
            print(f"Downloading NotoSansVietnamese-Regular.ttf...")
            urllib.request.urlretrieve(notosans_viet_url, target_path)
            print(f"Downloaded NotoSansVietnamese-Regular.ttf successfully")
        except Exception as e:
            print(f"Error downloading NotoSansVietnamese-Regular.ttf: {str(e)}")
            
    target_path = os.path.join(fonts_dir, "NotoSansVietnamese-Bold.ttf")
    if os.path.exists(target_path):
        print(f"NotoSansVietnamese-Bold.ttf already exists, skipping download.")
    else:
        try:
            print(f"Downloading NotoSansVietnamese-Bold.ttf...")
            urllib.request.urlretrieve(notosans_viet_bold_url, target_path)
            print(f"Downloaded NotoSansVietnamese-Bold.ttf successfully")
        except Exception as e:
            print(f"Error downloading NotoSansVietnamese-Bold.ttf: {str(e)}")
            
    return True

if __name__ == "__main__":
    print("Starting font downloads...")
    download_and_extract_dejavu_fonts()
    download_noto_sans_fonts()
    print("All font downloads completed!") 