from fastapi import FastAPI, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import json
import os
import re
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_community.llms import Ollama
from engine import get_engine
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# LangSmith Tracking (if needed)
os.environ["LANGCHAIN_API_KEY"] = os.getenv("LANGCHAIN_API_KEY")
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_PROJECT"] = "E-commerce Product ChatBot"

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Load the product data
try:
    with open("gearvn_products_fixed.json", "r", encoding="utf-8") as f:
        products_data = json.load(f)
    print(f"Loaded {len(products_data)} products from the dataset")
except Exception as e:
    print(f"Error loading product data: {e}")
    products_data = []

# Create a system prompt that helps with product consultation
system_template = """
You are a helpful AI assistant for a tech store. You provide product recommendations based on user queries.
You will be given information about products and a user query. Respond in Vietnamese.
When the user asks about product recommendations, analyze their requirements and suggest appropriate products.
"""

# Create the prompt template for product recommendation
product_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_template),
        ("user", "User query: {query}\nConsider these products: {relevant_products}")
    ]
)

# Basic test endpoint
@app.get("/test")
async def test_endpoint():
    return {"status": "ok", "message": "API is running"}

# Direct query endpoint
@app.post("/direct-query")
async def direct_query(query: str = Form(...), model: str = Form("deepseek")):
    # Find relevant products based on the query
    relevant_products = search_products(query)
    
    if not relevant_products:
        return {"response": []}
    
    # Format the products for the LLM
    product_info = format_products_for_llm(relevant_products[:5])  # Limit to 5 products
    
    # Generate response using the LLM
    llm = Ollama(model=get_engine(model))
    output_parser = StrOutputParser()
    
    chain = product_prompt | llm | output_parser
    
    # Just return the relevant products without LLM processing for now
    return {"response": relevant_products[:5]}

def search_products(query: str) -> List[Dict[str, Any]]:
    """Search for relevant products based on the query."""
    query = query.lower()
    results = []
    
    # Extract key search terms
    search_terms = []
    
    # Category detection
    if "laptop" in query:
        search_terms.append("laptop")
    if "pc" in query or "máy tính" in query:
        search_terms.append("pc")
    if "màn hình" in query or "monitor" in query:
        search_terms.append("màn hình")
    if "bàn phím" in query or "keyboard" in query:
        search_terms.append("bàn phím")
    if "chuột" in query or "mouse" in query:
        search_terms.append("chuột")
    if "tai nghe" in query or "headphone" in query:
        search_terms.append("tai nghe")
    
    # Brand detection
    brands = ["dell", "hp", "asus", "acer", "lenovo", "msi", "apple", "macbook", 
              "gigabyte", "razer", "logitech", "corsair", "samsung", "lg"]
    for brand in brands:
        if brand in query:
            search_terms.append(brand)
    
    # Extract price range
    price_limit = None
    price_min = None
    
    # For "dưới X triệu" (under X million)
    if "dưới" in query and "triệu" in query:
        # Find the number before "triệu"
        for word in query.split():
            if word.isdigit():
                price_limit = int(word) * 1000000
                break
                
    # For "từ X đến Y triệu" (from X to Y million)
    elif "từ" in query and "đến" in query and "triệu" in query:
        words = query.split()
        for i, word in enumerate(words):
            if word == "từ" and i+1 < len(words) and words[i+1].isdigit():
                price_min = int(words[i+1]) * 1000000
            if word == "đến" and i+1 < len(words) and words[i+1].isdigit():
                price_limit = int(words[i+1]) * 1000000
    
    # Extract specific needs
    if "gaming" in query or "game" in query or "chơi game" in query:
        search_terms.append("gaming")
    if "đồ họa" in query or "thiết kế" in query:
        search_terms.append("đồ họa")
    if "văn phòng" in query or "học tập" in query:
        search_terms.append("văn phòng")
    
    # Filter products based on search terms and price
    for product in products_data:
        product_name = product.get("name", "").lower()
        product_type = product.get("type", "").lower()
        product_desc = product.get("description", "").lower() if product.get("description") else ""
        product_price = product.get("price", 0)
        product_vendor = product.get("vendor", "").lower()
        
        # Check if product matches any search terms
        matches_terms = False
        if search_terms:
            for term in search_terms:
                if (term in product_name or 
                    term in product_type or 
                    term in product_desc or 
                    term in product_vendor):
                    matches_terms = True
                    break
        else:
            # If no specific terms, match all products
            matches_terms = True
        
        # Check if product is within price range
        within_price_max = product_price <= price_limit if price_limit else True
        within_price_min = product_price >= price_min if price_min else True
        
        if matches_terms and within_price_max and within_price_min:
            # Clean up the product data before returning
            clean_product = {
                "name": product.get("name", "Unknown Product"),
                "price": product.get("price", 0),
                "type": product.get("type", ""),
                "vendor": product.get("vendor", ""),
                "link": product.get("link", ""),
                "image": product.get("image", ""),
                "specs": extract_specs(product)
            }
            results.append(clean_product)
    
    # Sort results by relevance (number of matching terms) and then by price
    if search_terms:
        results.sort(key=lambda p: (
            -sum(term in (p.get("name", "").lower() + p.get("type", "").lower()) for term in search_terms),
            p.get("price", 0)
        ))
    else:
        # If no search terms, sort by price
        results.sort(key=lambda p: p.get("price", 0))
    
    return results

def extract_specs(product: Dict[str, Any]) -> str:
    """Extract key specifications from product data."""
    specs = []
    
    # Extract CPU info if available
    if product.get("cpu"):
        specs.append(f"CPU: {product.get('cpu')}")
    
    # Extract RAM info if available
    if product.get("ram"):
        specs.append(f"RAM: {product.get('ram')}")
    
    # Extract storage info if available
    if product.get("storage"):
        specs.append(f"Storage: {product.get('storage')}")
    
    # Extract GPU info if available
    if product.get("gpu"):
        specs.append(f"GPU: {product.get('gpu')}")
    
    # Extract display info if available
    if product.get("display"):
        specs.append(f"Display: {product.get('display')}")
    
    # If no specific specs found, try to extract from description
    if not specs and product.get("description"):
        # Look for common spec patterns in the description
        desc = product.get("description", "")
        
        # CPU patterns
        cpu_match = re.search(r'CPU[:\s]+(.*?)(,|\.|$)', desc)
        if cpu_match:
            specs.append(f"CPU: {cpu_match.group(1).strip()}")
        
        # RAM patterns
        ram_match = re.search(r'RAM[:\s]+(.*?)(,|\.|$)', desc)
        if ram_match:
            specs.append(f"RAM: {ram_match.group(1).strip()}")
        
        # GPU patterns
        gpu_match = re.search(r'(VGA|GPU|Card đồ họa)[:\s]+(.*?)(,|\.|$)', desc)
        if gpu_match:
            specs.append(f"GPU: {gpu_match.group(2).strip()}")
    
    return ", ".join(specs)

def format_products_for_llm(products: List[Dict[str, Any]]) -> str:
    """Format product information for the LLM."""
    formatted = ""
    for i, product in enumerate(products, 1):
        formatted += f"{i}. {product.get('name', 'Unknown Product')}\n"
        formatted += f"   Giá: {format_price(product.get('price', 0))}\n"
        formatted += f"   Đặc điểm: {product.get('specs', 'Không có thông tin')}\n\n"
    return formatted

def format_price(price: int) -> str:
    """Format price in Vietnamese currency format."""
    return f"{price:,}đ".replace(",", ".")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)