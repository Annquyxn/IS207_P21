import json
import re
import logging
import os
import glob

logger = logging.getLogger(__name__)

def extract_price_limit(query):
    price_match = re.search(r"(?:dưới|bé hơn|nhỏ hơn|tầm giá|dưới mức|khoảng|tầm|giá)?\s*(\d+([\.,]?\d+)*)\s*(nghìn|k|triệu|tr)?", query)
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
    # Loại bỏ các từ khoá về giá và các từ khoá không liên quan
    keyword = re.sub(r"(mua|bán|dưới|bé hơn|nhỏ hơn|tầm giá|khoảng|tầm|giá|\d+([\.,]?\d+)*\s*(nghìn|k|triệu|tr)?)", "", query)
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
        
        # Remove duplicate products based on title
        seen_titles = set()
        unique_products = []
        for p in products:
            if p.get('title') not in seen_titles:
                seen_titles.add(p.get('title'))
                unique_products.append(p)
        
        logger.info(f"Reduced to {len(unique_products)} unique products after removing duplicates")
        
        # Filter products based on keyword and price limit
        filtered_products = unique_products
        
        # Always apply price filter first if available
        if price_limit:
            logger.info(f"Filtering by price limit: {price_limit}")
            filtered_products = []
            for p in unique_products:
                try:
                    price = p.get('price', 0)
                    # Handle price as string (with commas/dots)
                    if isinstance(price, str):
                        price = price.replace('.', '').replace(',', '')
                        price = int(price)
                    # Ensure price is an int
                    elif not isinstance(price, int):
                        price = int(float(price))
                    
                    if price <= price_limit:
                        p['price'] = price  # Update with normalized price
                        filtered_products.append(p)
                except Exception as e:
                    logger.error(f"Error processing price for product: {p.get('title', 'Unknown')}: {str(e)}")
            
            logger.info(f"After price filter: {len(filtered_products)} products")
            
        # Then apply keyword filter if available and not empty
        if keyword and keyword.strip():
            keyword_lower = keyword.lower()
            logger.info(f"Filtering by keyword: '{keyword_lower}'")
            
            # First try exact match on product_type
            exact_type_matches = [p for p in filtered_products 
                              if p.get('product_type', '').lower() == keyword_lower]
            
            # If exact matches found, prioritize those
            if exact_type_matches:
                logger.info(f"Found {len(exact_type_matches)} exact product type matches")
                filtered_products = exact_type_matches
            else:
                # Try to match on common product categories if no specific keyword
                if keyword_lower in ["laptop", "máy tính"]:
                    category_matches = [p for p in filtered_products 
                                     if "laptop" in p.get('title', '').lower() 
                                     or "máy tính" in p.get('title', '').lower()]
                    if category_matches:
                        filtered_products = category_matches
                elif keyword_lower in ["pc", "máy tính để bàn"]:
                    category_matches = [p for p in filtered_products 
                                     if "pc" in p.get('title', '').lower() 
                                     or "máy tính để bàn" in p.get('title', '').lower()]
                    if category_matches:
                        filtered_products = category_matches
                else:
                    # Otherwise use partial matching on title
                    title_matches = [p for p in filtered_products 
                                   if keyword_lower in p.get('title', '').lower()]
                    if title_matches:
                        filtered_products = title_matches
        
        logger.info(f"Filtered to {len(filtered_products)} products")
        
        # Sort results by popularity/relevance (we'll use price as a proxy for now)
        filtered_products.sort(key=lambda p: p.get('price', 0), reverse=True)
        
        # If still too many results, take a sample across the price range
        if len(filtered_products) > 8:
            # Take some from high, middle and low price ranges
            high_end = filtered_products[:3]  # 3 most expensive
            
            mid_start = len(filtered_products) // 2 - 1
            mid_end = mid_start + 2
            mid_range = filtered_products[mid_start:mid_end]  # 3 mid-range
            
            low_start = max(0, len(filtered_products) - 2)
            low_range = filtered_products[low_start:]  # 2 least expensive
            
            filtered_products = high_end + mid_range + low_range
        
        # Convert to result format
        results = []
        for p in filtered_products[:8]:  # Limit to 8 results
            try:
                price = p.get('price', 0)
                # Ensure price is integer
                if not isinstance(price, int):
                    if isinstance(price, str):
                        price = int(price.replace('.', '').replace(',', ''))
                    else:
                        price = int(float(price))
                
                results.append({
                    "name": p.get('title', ''),
                    "price": price,
                    "type": p.get('product_type', ''),
                    "vendor": p.get('vendor', ''),
                    "link": p.get('link', ''),
                    "image": p.get('image', {}).get('src') if isinstance(p.get('image'), dict) else p.get('image', '')
                })
            except Exception as e:
                logger.error(f"Error processing result: {str(e)}")
        
        # Add debugging info
        logger.info(f"Returning {len(results)} products")
        for i, result in enumerate(results):
            logger.info(f"Result {i+1}: {result['name']} - {result['price']}")
        
        return results if results else [{"message": "Không tìm thấy sản phẩm phù hợp"}]

    except Exception as e:
        logger.error(f"Error querying products: {str(e)}")
        return [{"message": f"Lỗi khi tìm kiếm sản phẩm: {str(e)}"}]