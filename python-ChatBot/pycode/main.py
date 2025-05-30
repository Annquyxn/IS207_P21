import os
from pathlib import Path
from typing import List, Optional, Dict, Any
import pandas as pd
import numpy as np
from fastapi import FastAPI, Form, HTTPException, Request, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import re
from groq import Groq
import logging
import json
from datetime import datetime
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Configure logging to show more details
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


project_root = Path(__file__).resolve().parent
env_file = project_root / ".env"

# Check if .env file exists, create it if not
if not env_file.exists():
    logger.info(f".env file not found at {env_file}, creating a default one")
    with open(env_file, "w") as f:
        f.write("# Environment variables for ChatBot API\n")
        f.write("GROQ_API_KEY=your_groq_api_key_here\n")
        f.write("# Add other environment variables as needed\n")
    logger.info(f"Default .env file created at {env_file}")

# Load environment variables from .env file
load_dotenv(env_file)
logger.info(f"Loaded environment variables from {env_file}")

# Create directories for static files if they don't exist
STATIC_DIR = project_root / "static"
IMAGES_DIR = STATIC_DIR / "images"
CACHE_DIR = STATIC_DIR / "cache"

for directory in [STATIC_DIR, IMAGES_DIR, CACHE_DIR]:
    directory.mkdir(exist_ok=True, parents=True)

# Check for required environment variables
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY or GROQ_API_KEY == "your_groq_api_key_here":
    logger.warning("GROQ_API_KEY not found or not properly set in environment variables. API functions will be limited.")
else:
    logger.info("GROQ_API_KEY successfully loaded")

app = FastAPI(title="TechBot API")

# Configure CORS to allow requests from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],  # Allow all common methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],  # Expose all headers
)

# Mount static files directory
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

@app.get("/")
async def root():
    logger.info("Root endpoint called")
    return {"status": "ok", "message": "ChatBot API is running"}

# Test endpoint that frontend uses to check connectivity
@app.get("/test")
async def test_endpoint():
    logger.info("Test endpoint called")
    return {"status": "ok", "message": "API is running"}

class ProductSpec(BaseModel):
    name: str
    value: str

class Product(BaseModel):
    id: str = ""
    name: str
    price: int
    original_price: Optional[int] = None
    discount_percent: Optional[int] = None
    type: str = ""
    vendor: str = ""
    image: Optional[str] = None
    link: Optional[str] = None
    description: Optional[str] = None
    rating: Optional[float] = None
    specs: Optional[List[ProductSpec]] = None
    availability: Optional[str] = "Còn hàng"
    popularity_score: Optional[float] = None
    similar_products: Optional[List[str]] = None

class QueryResponse(BaseModel):
    response: List[Dict[str, Any]]

class ComparisonResult(BaseModel):
    products: List[Product]
    comparison_table: Dict[str, Dict[str, str]]
    recommendation: str

# Load and preprocess the data
products_df = pd.read_csv('gearvn_products_transformed.csv')

# Feature vectorizer for product similarity
product_vectorizer = None
product_vectors = None

def clean_data():
    global products_df, product_vectorizer, product_vectors
    
    # Basic cleaning
    products_df = products_df.fillna('')
    
    # Convert price columns to numeric
    for col in ['salePrice', 'price']:
        if col in products_df.columns:
            products_df[col] = pd.to_numeric(products_df[col], errors='coerce')
    
    # Calculate discount percentage
    if 'price' in products_df.columns and 'salePrice' in products_df.columns:
        products_df['discount_percent'] = np.where(
            products_df['price'] > 0,
            np.round(((products_df['price'] - products_df['salePrice']) / products_df['price']) * 100),
            0
        )
    
    # Extract specs from description
    def extract_specs(description):
        specs = []
        description = str(description)
        # Look for patterns like "CPU: Intel i7" or "RAM: 16GB"
        spec_patterns = [
            (r'CPU[:\s]+([^,\n]+)', 'CPU'),
            (r'RAM[:\s]+([^,\n]+)', 'RAM'),
            (r'GPU[:\s]+([^,\n]+)', 'GPU'),
            (r'VGA[:\s]+([^,\n]+)', 'GPU'),
            (r'Card[:\s]+([^,\n]+)', 'GPU'),
            (r'Màn hình[:\s]+([^,\n]+)', 'Màn hình'),
            (r'Ổ cứng[:\s]+([^,\n]+)', 'Ổ cứng'),
            (r'SSD[:\s]+([^,\n]+)', 'Ổ cứng'),
            (r'HDD[:\s]+([^,\n]+)', 'Ổ cứng'),
            (r'Pin[:\s]+([^,\n]+)', 'Pin'),
            (r'Trọng lượng[:\s]+([^,\n]+)', 'Trọng lượng')
        ]
        
        for pattern, name in spec_patterns:
            matches = re.findall(pattern, description, re.IGNORECASE)
            if matches:
                specs.append({"name": name, "value": matches[0].strip()})
                
        return specs
    
    products_df['specs'] = products_df['description'].apply(extract_specs)
    
    # Extract product type
    def extract_product_type(row):
        title = str(row['title']).lower()
        description = str(row['description']).lower()
        
        # Dictionary mapping keywords to product types
        type_keywords = {
            'Laptop': ['laptop', 'macbook', 'notebook'],
            'PC': ['pc', 'máy tính', 'desktop', 'máy bộ'],
            'Card màn hình': ['card', 'vga', 'gpu', 'gtx', 'rtx', 'geforce', 'radeon'],
            'RAM': ['ram', 'memory', 'ddr3', 'ddr4', 'ddr5'],
            'Ổ cứng': ['ssd', 'hdd', 'ổ cứng', 'nvme', 'storage'],
            'Mainboard': ['mainboard', 'bo mạch chủ', 'motherboard'],
            'Màn hình': ['màn hình', 'monitor', 'display'],
            'Chuột': ['chuột', 'mouse'],
            'Bàn phím': ['bàn phím', 'keyboard'],
            'Tai nghe': ['tai nghe', 'headphone', 'earphone', 'headset'],
            'CPU': ['cpu', 'processor', 'ryzen', 'intel', 'core i'],
            'Tản nhiệt': ['tản nhiệt', 'cooling', 'fan', 'radiator', 'cooler'],
            'Nguồn máy tính': ['nguồn', 'power supply', 'psu'],
            'Case máy tính': ['case', 'vỏ máy tính', 'thùng máy']
        }
        
        # Check title first (higher priority)
        for product_type, keywords in type_keywords.items():
            for keyword in keywords:
                if keyword in title:
                    return product_type
        
        # Then check description
        for product_type, keywords in type_keywords.items():
            for keyword in keywords:
                if keyword in description:
                    return product_type
        
        # Default fallback
        return 'Phụ kiện'
    
    products_df['product_type'] = products_df.apply(extract_product_type, axis=1)
    
    # Make sure 'discount_percent' exists and is filled with zeros if missing
    if 'discount_percent' not in products_df.columns:
        products_df['discount_percent'] = 0
    else:
        products_df['discount_percent'] = products_df['discount_percent'].fillna(0)
    
    # Make sure 'rating' exists and is filled with zeros if missing
    if 'rating' not in products_df.columns:
        products_df['rating'] = 0
    else:
        products_df['rating'] = products_df['rating'].fillna(0)
    
    # Calculate popularity score based on rating, discount, etc.
    products_df['popularity_score'] = (
        products_df['rating'] * 0.5 + 
        products_df['discount_percent'] * 0.3 +
        (products_df['salePrice'] < 10000000).astype(int) * 0.2  # More affordable products get a boost
    )
    
    # Generate product vectors for similarity comparison
    product_texts = products_df.apply(
        lambda row: f"{row['title']} {row['description']} {row['brand']} {row['product_type']}", 
        axis=1
    )
    
    # Create TF-IDF vectorizer
    product_vectorizer = TfidfVectorizer(max_features=100, stop_words=['và', 'của', 'có', 'là', 'với'])
    product_vectors = product_vectorizer.fit_transform(product_texts)
    
    # Find similar products
    def find_similar_products(row_idx, n=3):
        if product_vectors is None or row_idx >= product_vectors.shape[0]:
            return []
            
        product_id = products_df.iloc[row_idx]['id']
        product_vector = product_vectors[row_idx:row_idx+1]
        
        # Calculate similarity with all other products
        similarities = cosine_similarity(product_vector, product_vectors).flatten()
        
        # Get indices of top similar products (excluding self)
        similar_indices = similarities.argsort()[:-n-2:-1]
        similar_products = []
        
        for idx in similar_indices:
            if products_df.iloc[idx]['id'] != product_id:  # Exclude self
                similar_products.append(products_df.iloc[idx]['id'])
                
        return similar_products
    
    # Add similar products to each product
    products_df['similar_products'] = [find_similar_products(i) for i in range(len(products_df))]

clean_data()

class GroqAPI:
    def __init__(self, model_name: str):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("API key is missing. Please set the GROQ_API_KEY environment variable.")
        self.client = Groq(api_key=api_key)
        self.model_name = model_name
        self.system_prompt = """Bạn là một trợ lý AI chuyên nghiệp về tư vấn mua sắm thiết bị điện tử, máy tính và phụ kiện công nghệ.
        
        Khi người dùng hỏi về sản phẩm hoặc mua sắm:
        1. Luôn chào hỏi khách hàng một cách lịch sự, thân thiện
        2. Phân tích nhu cầu của khách từ câu hỏi một cách chuyên nghiệp
        3. Đưa ra gợi ý phù hợp dựa trên các sản phẩm có sẵn với lý do cụ thể
        4. So sánh các đặc điểm nổi bật giữa các sản phẩm gợi ý
        5. Tóm tắt đề xuất cuối cùng với 1-2 sản phẩm tốt nhất
        6. Nhắc khách hàng có thể hỏi thêm thông tin về sản phẩm
        
        Khi so sánh sản phẩm:
        1. Nêu rõ ưu và nhược điểm của từng sản phẩm
        2. So sánh cấu hình, giá cả và tính năng
        3. Cho biết sản phẩm nào phù hợp nhất với nhu cầu khách hàng
        
        Khi không tìm thấy sản phẩm phù hợp:
        1. Xin lỗi khách hàng một cách chân thành
        2. Đề xuất tìm kiếm với từ khóa khác
        3. Hoặc đề xuất các sản phẩm thay thế tương tự
        
        Khi người dùng trò chuyện về các chủ đề không liên quan đến sản phẩm:
        1. Trả lời một cách tự nhiên, thân thiện và hữu ích
        2. Cung cấp thông tin hoặc ý kiến nếu được hỏi
        3. Luôn trả lời bằng tiếng Việt một cách lịch sự
        4. Sẵn sàng chuyển hướng sang tư vấn sản phẩm nếu người dùng cần"""

    def get_response(self, user_query: str, products: List[Product] = None, is_product_query: bool = True, 
                     comparison_mode: bool = False, product_categories: List[str] = None) -> str:
        if is_product_query and products:
            # Format product information in a more structured way
            product_info = "\n\n".join([
                f"### {i+1}. {p.name}\n" +
                f"- **Giá**: {p.price:,}đ" +
                (f" (Giảm {p.discount_percent}% từ {p.original_price:,}đ)" if p.original_price and p.discount_percent else "") + "\n" +
                f"- **Loại**: {p.type}\n" +
                f"- **Hãng**: {p.vendor}\n" +
                (f"- **Đánh giá**: {p.rating}/5 sao\n" if p.rating else "") +
                (f"- **Thông số kỹ thuật**:\n  " + "\n  ".join([f"+ {spec.name}: {spec.value}" for spec in p.specs]) + "\n" if p.specs else "") +
                (f"- **Mô tả**: {p.description}\n" if p.description else "")
                for i, p in enumerate(products)
            ])
            
            if comparison_mode:
                prompt = f"""Query của khách hàng: {user_query}

Khách hàng muốn so sánh các sản phẩm sau:
{product_info}

Hãy phân tích và so sánh chi tiết các sản phẩm trên cho khách hàng, bao gồm:
1. So sánh về cấu hình và thông số kỹ thuật
2. So sánh về giá cả và khuyến mãi
3. Đánh giá ưu và nhược điểm của từng sản phẩm
4. Đề xuất sản phẩm phù hợp nhất với nhu cầu của khách và lý do

Trả lời một cách chuyên nghiệp, trực quan và dễ hiểu."""
            else:
                prompt = f"""Query của khách hàng: {user_query}

Các sản phẩm phù hợp với yêu cầu:
{product_info}

{f"Các loại sản phẩm tìm thấy: {', '.join(product_categories)}" if product_categories else ""}

Hãy tư vấn cho khách hàng về các sản phẩm trên một cách tự nhiên, thân thiện và chuyên nghiệp. 
Phân tích ưu điểm của từng sản phẩm và đề xuất sản phẩm phù hợp nhất với nhu cầu của khách."""
        elif is_product_query:
            prompt = f"""Query của khách hàng: {user_query}

Hiện tại không tìm thấy sản phẩm phù hợp với yêu cầu này.
Hãy đưa ra phản hồi thân thiện và gợi ý cách tìm kiếm khác hoặc sản phẩm thay thế.
Ví dụ khách có thể tìm với từ khóa khác, hoặc mở rộng phạm vi tìm kiếm."""
        else:
            # Handle general conversation
            prompt = f"""Câu hỏi của người dùng: {user_query}

Đây không phải là câu hỏi về sản phẩm mà là một câu hỏi thông thường.
Hãy trả lời một cách tự nhiên, thân thiện và hữu ích bằng tiếng Việt."""

        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": prompt}
        ]

        response = self.client.chat.completions.create(
            model=self.model_name,
            messages=messages,
            temperature=0.7,
            max_tokens=1024,
            stop=None,
        )
        return response.choices[0].message.content

def is_product_query(query: str) -> bool:
    """Determine if the query is about products or general conversation."""
    # List of common Vietnamese greetings and general phrases that are not product-related
    general_phrases = [
        'chào', 'xin chào', 'hello', 'hi', 'hey', 'chào buổi sáng', 'chào buổi chiều', 'chào buổi tối', 
        'tạm biệt', 'bye', 'gặp lại sau', 'cảm ơn', 'khỏe không', 'khỏe không?', 'thế nào', 'thế nào?',
        'bạn tên gì', 'bạn là ai', 'ai vậy', 'được làm bằng gì', 'làm thế nào', 'như thế nào', 
        'giúp tôi', 'giúp đỡ', 'trợ giúp', 'tư vấn', 'giới thiệu', 'kể cho tôi', 'thời tiết', 
        'dự báo', 'hôm nay', 'ngày mai', 'hôm qua', 'cuối tuần'
    ]
    
    query_lower = query.lower().strip()
    
    # Check if query is just a greeting or general conversation
    for phrase in general_phrases:
        if query_lower == phrase or query_lower.startswith(phrase + ' ') or query_lower.endswith(' ' + phrase):
            return False
    
    # If the query is very short (less than 3 words) and doesn't contain product terms, 
    # it's likely a general conversation
    if len(query_lower.split()) < 3:
        product_found = False
        for keyword in ['mua', 'giá', 'sản phẩm', 'laptop', 'máy tính']:
            if keyword in query_lower:
                product_found = True
                break
        if not product_found:
            return False
    
    # List of product-related keywords
    product_keywords = [
        'mua', 'giá', 'bao nhiêu', 'sản phẩm', 'laptop', 'máy tính', 'pc', 
        'card', 'màn hình', 'tai nghe', 'bàn phím', 'chuột', 'ram', 'ssd', 
        'ổ cứng', 'mainboard', 'cpu', 'amd', 'intel', 'nvidia', 'geforce', 
        'radeon', 'gaming', 'asus', 'acer', 'dell', 'hp', 'lenovo', 'msi',
        'gigabyte', 'corsair', 'logitech', 'razer', 'cooler master', 'kingston',
        'western digital', 'seagate', 'samsung', 'apple', 'macbook', 'gợi ý',
        'tư vấn', 'so sánh', 'phù hợp', 'nên mua', 'tốt nhất', 'chất lượng'
    ]
    
    # Check for product-related keywords
    for keyword in product_keywords:
        if keyword in query_lower:
            return True
            
    # Check for price inquiries
    if re.search(r'\d+(?:[,.]\d+)?\s*(?:đồng|vnd|triệu|tr|k|nghìn)?', query_lower):
        return True
        
    # If no product keywords are found, it's probably a general conversation
    return False

def is_comparison_query(query: str) -> bool:
    """Determine if the query is asking for product comparison."""
    query_lower = query.lower().strip()
    
    comparison_keywords = [
        'so sánh', 'đối chiếu', 'khác nhau', 'giống nhau', 'khác biệt', 
        'ưu điểm', 'nhược điểm', 'lợi thế', 'nên chọn', 'tốt hơn', 'tệ hơn',
        'vs', 'versus', 'đấu với', 'hay', 'hoặc', 'nên mua cái nào'
    ]
    
    for keyword in comparison_keywords:
        if keyword in query_lower:
            return True
            
    # Check for patterns like "A hay B", "A hoặc B", "A vs B"
    if re.search(r'\w+\s+(hay|hoặc|vs|or)\s+\w+', query_lower):
        return True
        
    return False

def extract_price_range(query: str) -> tuple:
    """Extract price range from query."""
    query_lower = query.lower()
    
    min_price = 0
    max_price = float('inf')
    
    # Check for "từ X đến Y" pattern
    range_pattern = r'từ\s+(\d+(?:[,.]\d+)?)\s*(?:triệu|tr|k|nghìn|đồng|vnd)?\s+đến\s+(\d+(?:[,.]\d+)?)\s*(?:triệu|tr|k|nghìn|đồng|vnd)?'
    range_match = re.search(range_pattern, query_lower)
    if range_match:
        min_value = float(range_match.group(1).replace(',', '.'))
        max_value = float(range_match.group(2).replace(',', '.'))
        
        # Check for units in the matched text
        if 'triệu' in range_match.group(0) or 'tr' in range_match.group(0):
            min_price = min_value * 1000000
            max_price = max_value * 1000000
        elif 'k' in range_match.group(0) or 'nghìn' in range_match.group(0):
            min_price = min_value * 1000
            max_price = max_value * 1000
        else:
            min_price = min_value
            max_price = max_value
        
        return min_price, max_price
    
    # Check for "dưới X" pattern
    if 'dưới' in query_lower and any(d.isdigit() for d in query_lower):
        price_str = re.search(r'dưới\s+(\d+(?:[,.]\d+)?)\s*(?:triệu|tr|k|nghìn|đồng|vnd)?', query_lower)
        if price_str:
            price_value = float(price_str.group(1).replace(',', '.'))
            unit = price_str.group(0)
            if 'triệu' in unit or 'tr' in unit:
                max_price = price_value * 1000000
            elif 'k' in unit or 'nghìn' in unit:
                max_price = price_value * 1000
            else:
                max_price = price_value
    
    # Check for "trên X" pattern
    if 'trên' in query_lower and any(d.isdigit() for d in query_lower):
        price_str = re.search(r'trên\s+(\d+(?:[,.]\d+)?)\s*(?:triệu|tr|k|nghìn|đồng|vnd)?', query_lower)
        if price_str:
            price_value = float(price_str.group(1).replace(',', '.'))
            unit = price_str.group(0)
            if 'triệu' in unit or 'tr' in unit:
                min_price = price_value * 1000000
            elif 'k' in unit or 'nghìn' in unit:
                min_price = price_value * 1000
            else:
                min_price = price_value
    
    # Check for "khoảng X" pattern (creates a range around X)
    if 'khoảng' in query_lower and any(d.isdigit() for d in query_lower):
        price_str = re.search(r'khoảng\s+(\d+(?:[,.]\d+)?)\s*(?:triệu|tr|k|nghìn|đồng|vnd)?', query_lower)
        if price_str:
            price_value = float(price_str.group(1).replace(',', '.'))
            unit = price_str.group(0)
            if 'triệu' in unit or 'tr' in unit:
                center_price = price_value * 1000000
            elif 'k' in unit or 'nghìn' in unit:
                center_price = price_value * 1000
            else:
                center_price = price_value
            
            # Create a range of +/- 20% around the center price
            min_price = center_price * 0.8
            max_price = center_price * 1.2
    
    return min_price, max_price

def extract_product_types(query: str) -> List[str]:
    """Extract product types from query."""
    query_lower = query.lower()
    
    product_type_keywords = {
        'Laptop': ['laptop', 'macbook', 'notebook', 'máy tính xách tay'],
        'PC': ['pc', 'máy tính', 'desktop', 'máy bộ', 'case', 'thùng máy'],
        'Card màn hình': ['card', 'vga', 'gpu', 'gtx', 'rtx', 'geforce', 'radeon'],
        'RAM': ['ram', 'memory', 'ddr3', 'ddr4', 'ddr5', 'thanh nhớ'],
        'Ổ cứng': ['ssd', 'hdd', 'ổ cứng', 'nvme', 'storage'],
        'Mainboard': ['mainboard', 'bo mạch chủ', 'motherboard'],
        'Màn hình': ['màn hình', 'monitor', 'display'],
        'Chuột': ['chuột', 'mouse'],
        'Bàn phím': ['bàn phím', 'keyboard'],
        'Tai nghe': ['tai nghe', 'headphone', 'earphone', 'headset'],
        'CPU': ['cpu', 'processor', 'ryzen', 'intel', 'core i'],
        'Tản nhiệt': ['tản nhiệt', 'cooling', 'fan', 'radiator', 'cooler'],
        'Nguồn máy tính': ['nguồn', 'power supply', 'psu'],
        'Case máy tính': ['case', 'vỏ máy tính', 'thùng máy']
    }
    
    found_types = []
    
    for product_type, keywords in product_type_keywords.items():
        for keyword in keywords:
            if keyword in query_lower:
                if product_type not in found_types:
                    found_types.append(product_type)
                break
    
    return found_types

def extract_brands(query: str) -> List[str]:
    """Extract brand names from query."""
    query_lower = query.lower()
    
    brand_keywords = [
        'asus', 'acer', 'dell', 'hp', 'lenovo', 'msi', 'gigabyte', 'apple', 
        'macbook', 'samsung', 'lg', 'corsair', 'cooler master', 'razer', 
        'logitech', 'kingston', 'western digital', 'seagate', 'intel', 'amd', 
        'nvidia', 'benq', 'viewsonic', 'steelseries', 'hyperx'
    ]
    
    found_brands = []
    
    for brand in brand_keywords:
        if brand in query_lower:
            found_brands.append(brand)
    
    return found_brands

def search_products(query: str, limit: int = 5) -> List[Product]:
    """Search for products matching the query."""
    global products_df
    
    query_lower = query.lower()
    
    # Extract price range
    min_price, max_price = extract_price_range(query)
    
    # Filter by price
    price_filtered = products_df[(products_df['salePrice'] >= min_price) & 
                               (products_df['salePrice'] <= max_price)]
    
    # Extract product types and brands
    product_types = extract_product_types(query)
    brands = extract_brands(query)
    
    # If specific product types are mentioned, filter by them
    if product_types:
        type_filtered = price_filtered[price_filtered['product_type'].isin(product_types)]
        if not type_filtered.empty:
            price_filtered = type_filtered
    
    # If specific brands are mentioned, filter by them
    if brands:
        brand_filtered = price_filtered[price_filtered['brand'].str.lower().isin(brands)]
        if not brand_filtered.empty:
            price_filtered = brand_filtered
    
    # Score products based on relevance to query
    scored_products = []
    
    for idx, row in price_filtered.iterrows():
        score = 0
        title_lower = str(row['title']).lower()
        desc_lower = str(row['description']).lower()
        brand_lower = str(row['brand']).lower()
        product_type = str(row['product_type']).lower()
        
        # Boost score for matching product type
        if product_types and product_type in [pt.lower() for pt in product_types]:
            score += 50
        
        # Boost score for matching brand
        if brands and brand_lower in brands:
            score += 30
        
        # Boost score for specific use cases mentioned in query
        use_cases = {
            'gaming': ['game', 'gaming', 'chơi game', 'fps', 'moba'],
            'work': ['làm việc', 'văn phòng', 'office', 'word', 'excel'],
            'design': ['thiết kế', 'design', 'đồ họa', 'photoshop', 'illustrator'],
            'student': ['học', 'sinh viên', 'student', 'học tập'],
            'portable': ['nhẹ', 'mỏng', 'di động', 'portable', 'mobility']
        }
        
        for use_case, keywords in use_cases.items():
            if any(keyword in query_lower for keyword in keywords):
                if any(keyword in title_lower or keyword in desc_lower for keyword in keywords):
                    score += 25
        
        # Score based on query terms appearing in title and description
        for term in query_lower.split():
            if len(term) > 2:
                if term in title_lower:
                    score += 20
                if term in desc_lower:
                    score += 5
        
        # Boost score based on rating and popularity
        if not pd.isna(row['rating']):
            score += row['rating'] * 2
        
        if not pd.isna(row['popularity_score']):
            score += row['popularity_score'] * 10
        
        # Slight boost for discounted items
        if 'discount_percent' in row and not pd.isna(row['discount_percent']) and row['discount_percent'] > 0:
            score += min(row['discount_percent'] * 0.2, 10)  # Cap at 10 points
        
        if score > 0:
            scored_products.append((score, idx))
    
    # Sort by score in descending order
    scored_products.sort(reverse=True, key=lambda x: x[0])
    
    # Get top products
    top_products = scored_products[:limit]
    
    # Convert to Product objects
    results = []
    for _, idx in top_products:
        row = products_df.iloc[idx]
        
        specs = []
        if 'specs' in row and row['specs']:
            if isinstance(row['specs'], str):
                try:
                    specs_list = json.loads(row['specs'])
                    specs = [ProductSpec(name=spec['name'], value=spec['value']) for spec in specs_list]
                except:
                    specs = []
            elif isinstance(row['specs'], list):
                specs = [ProductSpec(name=spec['name'], value=spec['value']) for spec in row['specs']]
        
        similar_products = []
        if 'similar_products' in row and row['similar_products']:
            if isinstance(row['similar_products'], str):
                try:
                    similar_products = json.loads(row['similar_products'])
                except:
                    similar_products = []
            elif isinstance(row['similar_products'], list):
                similar_products = row['similar_products']
        
        product = Product(
            id=str(row['id']),
            name=row['title'],
            price=int(row['salePrice']),
            original_price=int(row['price']) if 'price' in row and not pd.isna(row['price']) else None,
            discount_percent=int(row['discount_percent']) if 'discount_percent' in row and not pd.isna(row['discount_percent']) else None,
            type=row['product_type'],
            vendor=row['brand'],
            image=row['image'],
            link=f"https://gearvn.com/products/{row['id']}",
            description=row['description'][:200] + '...' if len(str(row['description'])) > 200 else row['description'],
            rating=float(row['rating']) if 'rating' in row and not pd.isna(row['rating']) else None,
            specs=specs,
            popularity_score=float(row['popularity_score']) if 'popularity_score' in row and not pd.isna(row['popularity_score']) else None,
            similar_products=similar_products
        )
        results.append(product)
    
    return results, product_types

@app.post("/direct-query")
@app.get("/direct-query")
async def query_endpoint(
    request: Request,
    query: Optional[str] = None,
    model: Optional[str] = Form(None) if Request.method == "POST" else None
):
    
    if request.method == "GET":
        query = request.query_params.get("query", "")
        model = request.query_params.get("model", "deepseek")
    elif not query:
        form_data = await request.form()
        query = form_data.get("query", "")
        model = form_data.get("model", "deepseek")
    
    logger.info(f"Received {request.method} request - Query: {query}, Model: {model}")
    
    if not query:
        raise HTTPException(status_code=400, detail="Query parameter is required")
    
    # Determine if this is a product query or general conversation
    product_related = is_product_query(query)
    logger.info(f"Query classified as {'product-related' if product_related else 'general conversation'}")
    
    # Check if this is a comparison query
    comparison_mode = is_comparison_query(query) if product_related else False
    if comparison_mode:
        logger.info("Query is a comparison request")
    
    # Only search for products if it's a product query
    products = []
    product_categories = []
    if product_related:
        products, product_categories = search_products(query, limit=5 if not comparison_mode else 3)
        logger.info(f"Found {len(products)} matching products in categories: {product_categories}")
    
    try:
        if not GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY not configured")
            
        groq_api = GroqAPI(model)
        logger.info("Successfully initialized Groq API")
        
        if product_related:
            if products:
                logger.info(f"Generating response with products in {'comparison' if comparison_mode else 'recommendation'} mode")
                response_text = groq_api.get_response(
                    query, 
                    products, 
                    is_product_query=True,
                    comparison_mode=comparison_mode,
                    product_categories=product_categories
                )
            else:
                logger.info("No products found, generating fallback response")
                response_text = groq_api.get_response(query, is_product_query=True)
        else:
            # Handle general conversation
            logger.info("Generating response for general conversation")
            response_text = groq_api.get_response(query, is_product_query=False)
        
        logger.info("Generated response text")
        
        # Prepare the response with enhanced visualization data
        response_content = {
            "response": [
                {"message": response_text, "type": "text"}
            ],
            "metadata": {
                "query_type": "product_comparison" if comparison_mode else "product_query" if product_related else "conversation",
                "product_categories": product_categories,
                "product_count": len(products),
                "timestamp": datetime.now().isoformat()
            }
        }
        
        # Add product information if this is a product query and products were found
        if product_related and products:
            product_responses = []
            for p in products:
                product_data = {
                    **p.dict(),
                    "type": "product",
                    "has_discount": p.discount_percent is not None and p.discount_percent > 0,
                    "has_specs": p.specs is not None and len(p.specs) > 0,
                    "price_formatted": f"{p.price:,}đ",
                    "original_price_formatted": f"{p.original_price:,}đ" if p.original_price else None,
                }
                product_responses.append(product_data)
                
            response_content["response"].extend(product_responses)
            
            # If in comparison mode, add a structured comparison table
            if comparison_mode and len(products) >= 2:
                # Create comparison data structure
                comparison_data = {"type": "comparison"}
                
                # Get all unique spec names across products
                all_specs = set()
                for p in products:
                    if p.specs:
                        all_specs.update([spec.name for spec in p.specs])
                
                # Create comparison table with rows for each spec
                comparison_table = {
                    "price": {p.name: f"{p.price:,}đ" for p in products},
                    "rating": {p.name: f"{p.rating}/5" if p.rating else "N/A" for p in products},
                    "brand": {p.name: p.vendor for p in products},
                }
                
                # Add rows for each specification
                for spec_name in sorted(all_specs):
                    comparison_table[spec_name] = {}
                    for p in products:
                        if p.specs:
                            spec_value = next((spec.value for spec in p.specs if spec.name == spec_name), "N/A")
                            comparison_table[spec_name][p.name] = spec_value
                        else:
                            comparison_table[spec_name][p.name] = "N/A"
                
                comparison_data["table"] = comparison_table
                response_content["response"].append(comparison_data)
        
        return JSONResponse(
            content=response_content,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            }
        )
            
    except ValueError as ve:
        logger.error(f"Configuration error: {str(ve)}")
        return JSONResponse(
            content={
                "response": [
                    {"message": "Xin chào! Dưới đây là một số sản phẩm phù hợp với yêu cầu của bạn:" if product_related else "Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.", "type": "text"},
                    *([{
                        **p.dict(), 
                        "type": "product",
                        "price_formatted": f"{p.price:,}đ",
                        "original_price_formatted": f"{p.original_price:,}đ" if p.original_price else None,
                      } for p in products] if product_related and products else [])
                ] if product_related and products else [
                    {"message": "Không tìm thấy sản phẩm phù hợp. Vui lòng thử lại với từ khóa khác." if product_related else "Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.", "type": "text"}
                ],
                "metadata": {
                    "query_type": "product_comparison" if comparison_mode else "product_query" if product_related else "conversation",
                    "product_categories": product_categories,
                    "product_count": len(products) if products else 0,
                    "timestamp": datetime.now().isoformat(),
                    "error": str(ve)
                }
            },
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            }
        )
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return JSONResponse(
            content={
                "response": [
                    {"message": "Xin chào! Dưới đây là một số sản phẩm phù hợp với yêu cầu của bạn:" if product_related else "Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.", "type": "text"},
                    *([{
                        **p.dict(), 
                        "type": "product",
                        "price_formatted": f"{p.price:,}đ",
                        "original_price_formatted": f"{p.original_price:,}đ" if p.original_price else None,
                      } for p in products] if product_related and products else [])
                ] if product_related and products else [
                    {"message": "Không tìm thấy sản phẩm phù hợp. Vui lòng thử lại với từ khóa khác." if product_related else "Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.", "type": "text"}
                ],
                "metadata": {
                    "query_type": "product_comparison" if comparison_mode else "product_query" if product_related else "conversation",
                    "product_categories": product_categories,
                    "product_count": len(products) if products else 0,
                    "timestamp": datetime.now().isoformat(),
                    "error": str(e)
                }
            },
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            }
        )

# New endpoint for product comparison
@app.post("/compare-products")
@app.get("/compare-products")
async def compare_products(
    request: Request,
    product_ids: Optional[str] = None
):
    if request.method == "GET":
        product_ids = request.query_params.get("product_ids", "")
    else:
        form_data = await request.form()
        product_ids = form_data.get("product_ids", "")
    
    if not product_ids:
        raise HTTPException(status_code=400, detail="product_ids parameter is required")
    
    try:
        # Parse product IDs from comma-separated string
        ids = [id.strip() for id in product_ids.split(",")]
        
        if len(ids) < 2:
            raise HTTPException(status_code=400, detail="At least 2 product IDs are required for comparison")
        
        # Find products by ID
        products = []
        for product_id in ids:
            product_rows = products_df[products_df['id'] == product_id]
            if not product_rows.empty:
                row = product_rows.iloc[0]
                
                specs = []
                if 'specs' in row and row['specs']:
                    if isinstance(row['specs'], str):
                        try:
                            specs_list = json.loads(row['specs'])
                            specs = [ProductSpec(name=spec['name'], value=spec['value']) for spec in specs_list]
                        except:
                            specs = []
                    elif isinstance(row['specs'], list):
                        specs = [ProductSpec(name=spec['name'], value=spec['value']) for spec in row['specs']]
                
                product = Product(
                    id=str(row['id']),
                    name=row['title'],
                    price=int(row['salePrice']),
                    original_price=int(row['price']) if 'price' in row and not pd.isna(row['price']) else None,
                    discount_percent=int(row['discount_percent']) if 'discount_percent' in row and not pd.isna(row['discount_percent']) else None,
                    type=row['product_type'],
                    vendor=row['brand'],
                    image=row['image'],
                    link=f"https://gearvn.com/products/{row['id']}",
                    description=row['description'],
                    rating=float(row['rating']) if 'rating' in row and not pd.isna(row['rating']) else None,
                    specs=specs
                )
                products.append(product)
        
        if not products:
            raise HTTPException(status_code=404, detail="No products found with the provided IDs")
        
        # Create comparison table with rows for each spec
        all_specs = set()
        for p in products:
            if p.specs:
                all_specs.update([spec.name for spec in p.specs])
        
        comparison_table = {
            "price": {p.name: f"{p.price:,}đ" for p in products},
            "rating": {p.name: f"{p.rating}/5" if p.rating else "N/A" for p in products},
            "brand": {p.name: p.vendor for p in products},
        }
        
        # Add rows for each specification
        for spec_name in sorted(all_specs):
            comparison_table[spec_name] = {}
            for p in products:
                if p.specs:
                    spec_value = next((spec.value for spec in p.specs if spec.name == spec_name), "N/A")
                    comparison_table[spec_name][p.name] = spec_value
                else:
                    comparison_table[spec_name][p.name] = "N/A"
        
        # Generate recommendation using AI
        try:
            if GROQ_API_KEY:
                groq_api = GroqAPI("deepseek")
                comparison_query = f"So sánh các sản phẩm: {', '.join([p.name for p in products])}"
                recommendation = groq_api.get_response(comparison_query, products, comparison_mode=True)
            else:
                recommendation = "Không thể tạo đề xuất do thiếu API key. Vui lòng so sánh sản phẩm dựa trên bảng thông số."
        except Exception as e:
            logger.error(f"Error generating recommendation: {str(e)}")
            recommendation = "Không thể tạo đề xuất do lỗi hệ thống. Vui lòng so sánh sản phẩm dựa trên bảng thông số."
        
        # Create response
        comparison_result = ComparisonResult(
            products=products,
            comparison_table=comparison_table,
            recommendation=recommendation
        )
        
        return JSONResponse(
            content=comparison_result.dict(),
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            }
        )
    except Exception as e:
        logger.error(f"Error processing comparison request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# New endpoint for getting similar products
@app.get("/similar-products/{product_id}")
async def get_similar_products(product_id: str):
    try:
        # Find product by ID
        product_rows = products_df[products_df['id'] == product_id]
        if product_rows.empty:
            raise HTTPException(status_code=404, detail=f"Product with ID {product_id} not found")
        
        row = product_rows.iloc[0]
        
        # Get similar product IDs
        similar_ids = []
        if 'similar_products' in row and row['similar_products']:
            if isinstance(row['similar_products'], str):
                try:
                    similar_ids = json.loads(row['similar_products'])
                except:
                    similar_ids = []
            elif isinstance(row['similar_products'], list):
                similar_ids = row['similar_products']
        
        # Find similar products
        similar_products = []
        for similar_id in similar_ids:
            similar_rows = products_df[products_df['id'] == similar_id]
            if not similar_rows.empty:
                similar_row = similar_rows.iloc[0]
                
                specs = []
                if 'specs' in similar_row and similar_row['specs']:
                    if isinstance(similar_row['specs'], str):
                        try:
                            specs_list = json.loads(similar_row['specs'])
                            specs = [ProductSpec(name=spec['name'], value=spec['value']) for spec in specs_list]
                        except:
                            specs = []
                    elif isinstance(similar_row['specs'], list):
                        specs = [ProductSpec(name=spec['name'], value=spec['value']) for spec in similar_row['specs']]
                
                product = Product(
                    id=str(similar_row['id']),
                    name=similar_row['title'],
                    price=int(similar_row['salePrice']),
                    original_price=int(similar_row['price']) if 'price' in similar_row and not pd.isna(similar_row['price']) else None,
                    discount_percent=int(similar_row['discount_percent']) if 'discount_percent' in similar_row and not pd.isna(similar_row['discount_percent']) else None,
                    type=similar_row['product_type'],
                    vendor=similar_row['brand'],
                    image=similar_row['image'],
                    link=f"https://gearvn.com/products/{similar_row['id']}",
                    description=similar_row['description'][:200] + '...' if len(str(similar_row['description'])) > 200 else similar_row['description'],
                    rating=float(similar_row['rating']) if 'rating' in similar_row and not pd.isna(similar_row['rating']) else None,
                    specs=specs
                )
                similar_products.append(product)
        
        return JSONResponse(
            content={"similar_products": [p.dict() for p in similar_products]},
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            }
        )
    except Exception as e:
        logger.error(f"Error finding similar products: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# New endpoint for product categorization and statistics
@app.get("/product-categories")
async def get_product_categories():
    try:
        # Get counts by category
        category_counts = products_df['product_type'].value_counts().to_dict()
        
        # Get price ranges by category
        price_ranges = {}
        for category in category_counts.keys():
            category_products = products_df[products_df['product_type'] == category]
            price_ranges[category] = {
                "min": int(category_products['salePrice'].min()),
                "max": int(category_products['salePrice'].max()),
                "avg": int(category_products['salePrice'].mean()),
                "median": int(category_products['salePrice'].median())
            }
        
        # Get top brands by category
        top_brands = {}
        for category in category_counts.keys():
            category_products = products_df[products_df['product_type'] == category]
            top_brands[category] = category_products['brand'].value_counts().head(5).to_dict()
        
        return JSONResponse(
            content={
                "categories": category_counts,
                "price_ranges": price_ranges,
                "top_brands": top_brands
            },
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            }
        )
    except Exception as e:
        logger.error(f"Error getting product categories: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("Starting uvicorn server at http://127.0.0.1:8000")
    try:
        uvicorn.run(app, host="127.0.0.1", port=8000)
    except Exception as e:
        logger.error(f"Failed to start server: {e}")
        print(f"ERROR: Failed to start server: {e}")