import os
import requests
import zipfile
import io
import shutil

def download_noto_sans_fonts():
    font_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "fonts")
    
    os.makedirs(font_dir, exist_ok=True)
    
    noto_regular_path = os.path.join(font_dir, "NotoSans-Regular.ttf")
    noto_bold_path = os.path.join(font_dir, "NotoSans-Bold.ttf")
    
    if os.path.exists(noto_regular_path) and os.path.exists(noto_bold_path):
        print("Noto Sans fonts already exist.")
        return
    
    noto_sans_url = "https://fonts.google.com/download?family=Noto%20Sans"
    
    try:
        print("Downloading Noto Sans fonts...")
        response = requests.get(noto_sans_url)
        
        if response.status_code == 200:
            with zipfile.ZipFile(io.BytesIO(response.content)) as zip_ref:
                temp_dir = os.path.join(font_dir, "temp")
                os.makedirs(temp_dir, exist_ok=True)
                zip_ref.extractall(temp_dir)
                
                for file in os.listdir(temp_dir):
                    if file.endswith(".ttf") and "NotoSans" in file:
                        src_path = os.path.join(temp_dir, file)
                        dst_path = os.path.join(font_dir, file)
                        shutil.copy(src_path, dst_path)
                        print(f"Copied {file} to {font_dir}")
                
                shutil.rmtree(temp_dir)
            
            print("Noto Sans fonts downloaded successfully.")
        else:
            print(f"Failed to download fonts. Status code: {response.status_code}")
            
            print("Using fallback method...")
            font_urls = {
                "NotoSans-Regular.ttf": "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf",
                "NotoSans-Bold.ttf": "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSans/NotoSans-Bold.ttf"
            }
            
            for font_name, url in font_urls.items():
                try:
                    font_response = requests.get(url)
                    if font_response.status_code == 200:
                        with open(os.path.join(font_dir, font_name), 'wb') as f:
                            f.write(font_response.content)
                        print(f"Downloaded {font_name} successfully.")
                    else:
                        print(f"Failed to download {font_name}. Status code: {font_response.status_code}")
                except Exception as e:
                    print(f"Error downloading {font_name}: {str(e)}")
    
    except Exception as e:
        print(f"Error downloading fonts: {str(e)}")
        
        if not (os.path.exists(noto_regular_path) or os.path.exists(noto_bold_path)):
            print("No fonts available. Using system fonts instead.")

if __name__ == "__main__":
    download_noto_sans_fonts()