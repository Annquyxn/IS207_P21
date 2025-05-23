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
        self.system_prompt = """Bạn là một trợ lý tư vấn mua sắm chuyên nghiệp tại cửa hàng máy tính.
        Hãy trả lời một cách thân thiện, chuyên nghiệp và tự nhiên bằng tiếng Việt.
        Khi tư vấn sản phẩm:
        1. Luôn chào hỏi khách hàng một cách lịch sự
        2. Phân tích nhu cầu của khách từ câu hỏi
        3. Đưa ra gợi ý phù hợp dựa trên các sản phẩm có sẵn
        4. Giải thích lý do tại sao sản phẩm đó phù hợp
        5. Sẵn sàng giải đáp thêm các thắc mắc
        
        Khi không tìm thấy sản phẩm phù hợp:
        1. Xin lỗi khách hàng một cách chân thành
        2. Đề xuất tìm kiếm với từ khóa khác
        3. Hoặc đề xuất các sản phẩm thay thế tương tự"""

    def get_response(self, user_query: str, products: List[Product] = None) -> str:
        if products:
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
        else:
            prompt = f"""Query của khách hàng: {user_query}

Hiện tại không tìm thấy sản phẩm phù hợp với yêu cầu này.
Hãy đưa ra phản hồi thân thiện và gợi ý cách tìm kiếm khác hoặc sản phẩm thay thế."""

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
    
    products = search_products(query)
    logger.info(f"Found {len(products)} matching products")
    
    try:
        if not GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY not configured")
            
        groq_api = GroqAPI(model)
        logger.info("Successfully initialized Groq API")
        
        if products:
            logger.info("Generating response with products")
            response_text = groq_api.get_response(query, products)
            logger.info("Generated response text")
            return JSONResponse(
                content={
                    "response": [
                        {"message": response_text, "type": "text"},
                        *[{**p.dict(), "type": "product"} for p in products]
                    ]
                },
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                }
            )
        else:
            logger.info("No products found, generating fallback response")
            response_text = groq_api.get_response(query)
            return JSONResponse(
                content={
                    "response": [
                        {"message": response_text, "type": "text"}
                    ]
                },
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
                    {"message": "Xin chào! Dưới đây là một số sản phẩm phù hợp với yêu cầu của bạn:", "type": "text"},
                    *[{**p.dict(), "type": "product"} for p in products]
                ] if products else [
                    {"message": "Không tìm thấy sản phẩm phù hợp. Vui lòng thử lại với từ khóa khác.", "type": "text"}
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
                    {"message": "Xin chào! Dưới đây là một số sản phẩm phù hợp với yêu cầu của bạn:", "type": "text"},
                    *[{**p.dict(), "type": "product"} for p in products]
                ] if products else [
                    {"message": "Không tìm thấy sản phẩm phù hợp. Vui lòng thử lại với từ khóa khác.", "type": "text"}
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