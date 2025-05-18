import json
import re
import logging
import os
import glob

logger = logging.getLogger(__name__)

def extract_price_limit(query):
    price_match = re.search(r"(?:dưới|bé hơn|nhỏ hơn)?\s*(\d+([\.,]?\d+)*)\s*(nghìn|k|triệu|tr)?", query)
    if price_match:
        raw_value = price_match.group(1).replace(",", ".")
        try:
            price_num = float(raw_value)
            unit = price_match.group(3)
            if unit in ["triệu", "tr"]:
                return int(price_num * 1_000_000)
            elif unit in ["nghìn", "k"]:
                return int(price_num * 1_000)
            else:
                return int(price_num)
        except:
            return None
    return None

def extract_keyword(query):
    keyword = re.sub(r"(mua|bán|dưới|bé hơn|nhỏ hơn|\d+([\.,]?\d+)*\s*(nghìn|k|triệu|tr)?)", "", query)
    return keyword.strip().lower()

def load_all_products():
    """Load all products from JSON files in the gearvn_classified directory"""
    products = []
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    json_dir = os.path.join(base_dir, "gearvn_classified")
    
    logger.info(f"Loading products from directory: {json_dir}")
    
    # Find all JSON files in the directory
    json_files = glob.glob(os.path.join(json_dir, "*.json"))
    logger.info(f"Found {len(json_files)} JSON files")
    
    for json_file in json_files:
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                file_products = json.load(f)
                logger.info(f"Loaded {len(file_products)} products from {os.path.basename(json_file)}")
                products.extend(file_products)
        except Exception as e:
            logger.error(f"Error loading {json_file}: {str(e)}")
    
    logger.info(f"Total products loaded: {len(products)}")
    return products

def query_sqlite_db(db_path: str, keyword: str = "", price_limit: int = None):
    """
    Query products from JSON files in the gearvn_classified directory
    Note: db_path parameter is kept for backward compatibility
    """
    try:
        # Load all products from JSON files
        products = load_all_products()
        
        # Filter products based on keyword and price limit
        filtered_products = products
        
        if keyword:
            filtered_products = [p for p in filtered_products 
                               if keyword.lower() in p.get('title', '').lower()]
            
        if price_limit:
            filtered_products = [p for p in filtered_products 
                               if p.get('price', 0) <= price_limit]
        
        logger.info(f"Filtered to {len(filtered_products)} products")
        
        # Convert to result format
        results = [
            {
                "name": p.get('title', ''),
                "price": p.get('price', 0),
                "type": p.get('product_type', ''),
                "vendor": p.get('vendor', ''),
                "link": p.get('link', ''),
                "image": p.get('image', '')
            }
            for p in filtered_products[:5]  # Limit to 5 results
        ]
        
        return results if results else [{"message": "Không tìm thấy sản phẩm phù hợp"}]

    except Exception as e:
        logger.error(f"Error querying products: {str(e)}")
        return [{"message": f"Lỗi khi tìm kiếm sản phẩm: {str(e)}"}]