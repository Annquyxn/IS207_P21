import json
import os
import glob
import logging

# Setup basic logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def load_products():
    """Test function to load products and verify the data structure"""
    products = []
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    json_dir = os.path.join(base_dir, "gearvn_classified")
    
    logger.info(f"Loading products from directory: {json_dir}")
    
    # Find all JSON files in the directory
    json_files = glob.glob(os.path.join(json_dir, "*.json"))
    logger.info(f"Found {len(json_files)} JSON files: {[os.path.basename(f) for f in json_files]}")
    
    for json_file in json_files:
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                try:
                    file_products = json.load(f)
                    if isinstance(file_products, list):
                        logger.info(f"Successfully loaded {len(file_products)} products from {os.path.basename(json_file)}")
                        
                        # Check the first product's structure
                        if file_products:
                            first_product = file_products[0]
                            logger.info(f"First product structure: {json.dumps(first_product, ensure_ascii=False, indent=2)[:500]}...")
                            
                            # Check price field specifically
                            if 'price' in first_product:
                                logger.info(f"Price field type: {type(first_product['price']).__name__}")
                                logger.info(f"Price value: {first_product['price']}")
                            else:
                                logger.warning(f"No 'price' field found in product")
                                
                        products.extend(file_products)
                    else:
                        logger.error(f"Expected a list, but got {type(file_products).__name__}")
                except json.JSONDecodeError as e:
                    logger.error(f"JSON decode error in {json_file}: {str(e)}")
        except Exception as e:
            logger.error(f"Error loading {json_file}: {str(e)}")
    
    logger.info(f"Total products loaded: {len(products)}")
    return products

def test_price_filter(products, price_limit=20000000):
    """Test filtering products by price limit"""
    if not products:
        logger.error("No products to filter")
        return []
    
    # Check price types for the first 10 products
    for i, product in enumerate(products[:10]):
        if i == 0:
            logger.info(f"Sample products for price check:")
        price = product.get('price', 0)
        logger.info(f"Product {i+1}: {product.get('title', 'Unknown')} - Price: {price} ({type(price).__name__})")
    
    # Try to convert all prices to int to ensure they're comparable
    clean_products = []
    for product in products:
        try:
            price = product.get('price', 0)
            # Handle price as string (with commas/dots)
            if isinstance(price, str):
                price = price.replace('.', '').replace(',', '')
                try:
                    price = int(price)
                except ValueError:
                    logger.warning(f"Couldn't convert price '{price}' to int for product: {product.get('title', 'Unknown')}")
                    continue
            # Ensure price is an int
            elif not isinstance(price, (int, float)):
                logger.warning(f"Unexpected price type {type(price).__name__} for product: {product.get('title', 'Unknown')}")
                continue
                
            product['price'] = int(price)
            clean_products.append(product)
        except Exception as e:
            logger.error(f"Error processing product price: {str(e)}")
    
    logger.info(f"Cleaned {len(clean_products)} products with valid prices")
    
    # Now filter by price
    filtered_products = [p for p in clean_products if p.get('price', 0) <= price_limit]
    logger.info(f"Found {len(filtered_products)} products under {price_limit:,} VND")
    
    # Log some of the filtered products
    for i, product in enumerate(filtered_products[:10]):
        if i == 0:
            logger.info(f"Sample products under {price_limit:,} VND:")
        logger.info(f"{i+1}. {product.get('title', 'Unknown')} - {product.get('price', 0):,} VND")
    
    return filtered_products

def save_fixed_products(products, output_file="gearvn_products_fixed.json"):
    """Save products with corrected price data"""
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output_path = os.path.join(base_dir, "gearvn_classified", output_file)
    
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
        logger.info(f"Successfully saved {len(products)} products to {output_file}")
    except Exception as e:
        logger.error(f"Error saving products: {str(e)}")

if __name__ == "__main__":
    logger.info("Starting product data test")
    
    # Load products
    products = load_products()
    
    # Test filtering by price
    filtered_products = test_price_filter(products, price_limit=20000000)
    
    # Save fixed products
    if filtered_products:
        save_fixed_products(filtered_products)
    
    logger.info("Test completed") 