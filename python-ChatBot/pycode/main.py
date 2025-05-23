import os
from pathlib import Path
from typing import List, Optional
import pandas as pd
from fastapi import FastAPI, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import re
from groq import Groq
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

project_root = Path(__file__).resolve().parent
load_dotenv(project_root / ".env")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    logger.warning("GROQ_API_KEY not found in environment variables")

app = FastAPI(title="TechBot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.options("/{path:path}")
async def options_handler(request: Request):
    return JSONResponse(
        content="OK",
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    )

class Product(BaseModel):
    name: str
    price: int
    type: str = ""
    vendor: str = ""
    image: Optional[str] = None
    link: Optional[str] = None
    description: Optional[str] = None

class QueryResponse(BaseModel):
    response: List[Product]

products_df = pd.read_csv('gearvn_products_transformed.csv')

def clean_data():
    global products_df
    products_df = products_df.fillna('')
    
    def extract_product_type(row):
        title = row['title'].lower()
        description = str(row['description']).lower()
        
        if 'laptop' in title:
            return 'Laptop'
        elif 'pc' in title or 'máy tính' in title:
            return 'PC'
        elif 'card' in title or 'vga' in title:
            return 'Card màn hình'
        elif 'ram' in title:
            return 'RAM'
        elif 'ssd' in title or 'ổ cứng' in title:
            return 'Ổ cứng'
        elif 'mainboard' in title or 'bo mạch chủ' in title:
            return 'Mainboard'
        elif 'màn hình' in title or 'monitor' in title:
            return 'Màn hình'
        elif 'chuột' in title or 'mouse' in title:
            return 'Chuột'
        elif 'bàn phím' in title or 'keyboard' in title:
            return 'Bàn phím'
        elif 'tai nghe' in title or 'headphone' in title:
            return 'Tai nghe'
        else:
            if 'laptop' in description:
                return 'Laptop'
            elif 'pc' in description or 'máy tính' in description:
                return 'PC'
            else:
                return 'Phụ kiện'
    
    products_df['product_type'] = products_df.apply(extract_product_type, axis=1)

clean_data()

class GroqAPI:
    def __init__(self, model_name: str):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("API key is missing. Please set the GROQ_API_KEY environment variable.")
        self.client = Groq(api_key=api_key)
        self.model_name = model_name
        self.system_prompt = """Bạn là một trợ lý AI đa năng, có thể trò chuyện và tư vấn sản phẩm.
        
        Khi người dùng hỏi về sản phẩm hoặc mua sắm:
        1. Luôn chào hỏi khách hàng một cách lịch sự
        2. Phân tích nhu cầu của khách từ câu hỏi
        3. Đưa ra gợi ý phù hợp dựa trên các sản phẩm có sẵn
        4. Giải thích lý do tại sao sản phẩm đó phù hợp
        5. Sẵn sàng giải đáp thêm các thắc mắc
        
        Khi không tìm thấy sản phẩm phù hợp:
        1. Xin lỗi khách hàng một cách chân thành
        2. Đề xuất tìm kiếm với từ khóa khác
        3. Hoặc đề xuất các sản phẩm thay thế tương tự
        
        Khi người dùng trò chuyện về các chủ đề không liên quan đến sản phẩm:
        1. Trả lời một cách tự nhiên, thân thiện và hữu ích
        2. Cung cấp thông tin hoặc ý kiến nếu được hỏi
        3. Luôn trả lời bằng tiếng Việt một cách lịch sự
        4. Sẵn sàng chuyển hướng sang tư vấn sản phẩm nếu người dùng cần"""

    def get_response(self, user_query: str, products: List[Product] = None, is_product_query: bool = True) -> str:
        if is_product_query and products:
            product_info = "\n".join([
                f"- {p.name} ({p.type}): {p.price:,}đ" +
                (f"\n  Thương hiệu: {p.vendor}" if p.vendor else "") +
                (f"\n  {p.description}" if p.description else "")
                for p in products
            ])
            
            prompt = f"""Query của khách hàng: {user_query}

Các sản phẩm phù hợp:
{product_info}

Hãy tư vấn cho khách hàng về các sản phẩm trên một cách tự nhiên, thân thiện và chuyên nghiệp. 
Phân tích ưu điểm của từng sản phẩm và đề xuất sản phẩm phù hợp nhất với nhu cầu của khách."""
        elif is_product_query:
            prompt = f"""Query của khách hàng: {user_query}

Hiện tại không tìm thấy sản phẩm phù hợp với yêu cầu này.
Hãy đưa ra phản hồi thân thiện và gợi ý cách tìm kiếm khác hoặc sản phẩm thay thế."""
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
        'western digital', 'seagate', 'samsung', 'apple', 'macbook'
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

def search_products(query: str, price_range: Optional[tuple] = None, limit: int = 5) -> List[Product]:
    global products_df
    
    query_lower = query.lower()
    
    min_price = 0
    max_price = float('inf')
    
    if price_range:
        min_price, max_price = price_range
    else:
        if 'dưới' in query_lower and any(d.isdigit() for d in query_lower):
            price_str = re.search(r'dưới\s+(\d+(?:[,.]\d+)?)\s*(?:triệu|tr|k|nghìn)?', query_lower)
            if price_str:
                price_value = float(price_str.group(1).replace(',', '.'))
                unit = price_str.group(0)
                if 'triệu' in unit or 'tr' in unit:
                    max_price = price_value * 1000000
                elif 'k' in unit or 'nghìn' in unit:
                    max_price = price_value * 1000
                else:
                    max_price = price_value
        
        if 'trên' in query_lower and any(d.isdigit() for d in query_lower):
            price_str = re.search(r'trên\s+(\d+(?:[,.]\d+)?)\s*(?:triệu|tr|k|nghìn)?', query_lower)
            if price_str:
                price_value = float(price_str.group(1).replace(',', '.'))
                unit = price_str.group(0)
                if 'triệu' in unit or 'tr' in unit:
                    min_price = price_value * 1000000
                elif 'k' in unit or 'nghìn' in unit:
                    min_price = price_value * 1000
                else:
                    min_price = price_value
    
    price_filtered = products_df[(products_df['salePrice'] >= min_price) & 
                                (products_df['salePrice'] <= max_price)]
    
    filtered_df = price_filtered
    
    scored_products = []
    
    for _, row in filtered_df.iterrows():
        score = 0
        title_lower = str(row['title']).lower()
        desc_lower = str(row['description']).lower()
        brand_lower = str(row['brand']).lower()
        product_type = str(row['product_type']).lower()
        
        if ('laptop' in query_lower and product_type == 'laptop') or \
           ('pc' in query_lower and product_type == 'pc') or \
           ('card' in query_lower and 'card màn hình' in product_type) or \
           ('màn hình' in query_lower and 'màn hình' in product_type):
            score += 50
        
        if brand_lower in query_lower:
            score += 30
        
        for term in query_lower.split():
            if len(term) > 2:
                if term in title_lower:
                    score += 20
                if term in desc_lower:
                    score += 5
        
        score += row['rating'] * 2
        
        if score > 0:
            scored_products.append((score, row))
    
    scored_products.sort(reverse=True, key=lambda x: x[0])
    
    top_products = scored_products[:limit]
    
    results = []
    for _, row in top_products:
        product = Product(
            name=row['title'],
            price=row['salePrice'],
            type=row['product_type'],
            vendor=row['brand'],
            image=row['image'],
            link=f"https://gearvn.com/products/{row['id']}",
            description=row['description'][:200] + '...' if len(row['description']) > 200 else row['description']
        )
        results.append(product)
    
    return results

@app.get("/test")
async def test_endpoint():
    return {"status": "ok", "message": "API is running"}

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
    
    # Only search for products if it's a product query
    products = search_products(query) if product_related else []
    if product_related:
        logger.info(f"Found {len(products)} matching products")
    
    try:
        if not GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY not configured")
            
        groq_api = GroqAPI(model)
        logger.info("Successfully initialized Groq API")
        
        if product_related:
            if products:
                logger.info("Generating response with products")
                response_text = groq_api.get_response(query, products, is_product_query=True)
            else:
                logger.info("No products found, generating fallback response")
                response_text = groq_api.get_response(query, is_product_query=True)
        else:
            # Handle general conversation
            logger.info("Generating response for general conversation")
            response_text = groq_api.get_response(query, is_product_query=False)
        
        logger.info("Generated response text")
        
        response_content = {
            "response": [
                {"message": response_text, "type": "text"}
            ]
        }
        
        # Add product information if this is a product query and products were found
        if product_related and products:
            response_content["response"].extend([{**p.dict(), "type": "product"} for p in products])
        
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
                    *([{**p.dict(), "type": "product"} for p in products] if product_related and products else [])
                ] if product_related and products else [
                    {"message": "Không tìm thấy sản phẩm phù hợp. Vui lòng thử lại với từ khóa khác." if product_related else "Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.", "type": "text"}
                ]
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
                    *([{**p.dict(), "type": "product"} for p in products] if product_related and products else [])
                ] if product_related and products else [
                    {"message": "Không tìm thấy sản phẩm phù hợp. Vui lòng thử lại với từ khóa khác." if product_related else "Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.", "type": "text"}
                ]
            },
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            }
        )

if __name__ == "_ _main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)