import pandas as pd
import numpy as np
import os
import json
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
from app.models.schemas import Product, ProductSpec

logger = logging.getLogger(__name__)

project_root = Path(__file__).resolve().parent.parent.parent
DATA_DIR = project_root / "app" / "data"

DATA_DIR.mkdir(exist_ok=True, parents=True)

class DataProcessor:
    def __init__(self):
        self.products_df = None
        self.load_data()
        
    def load_data(self):
        try:
            csv_path = DATA_DIR / "products.csv"
            if csv_path.exists():
                logger.info(f"Loading product data from {csv_path}")
                self.products_df = pd.read_csv(csv_path)
                return
                
            json_path = DATA_DIR / "products.json"
            if json_path.exists():
                logger.info(f"Loading product data from {json_path}")
                with open(json_path, 'r', encoding='utf-8') as f:
                    products_data = json.load(f)
                self.products_df = pd.DataFrame(products_data)
                return
                
            logger.warning("No product data found. Using empty DataFrame.")
            self.products_df = pd.DataFrame(columns=[
                'id', 'name', 'price', 'image_url', 'url', 
                'specs', 'category', 'brand', 'description'
            ])
            
        except Exception as e:
            logger.error(f"Error loading product data: {e}")
            self.products_df = pd.DataFrame(columns=[
                'id', 'name', 'price', 'image_url', 'url', 
                'specs', 'category', 'brand', 'description'
            ])
    
    def get_product_by_id(self, product_id: str) -> Optional[Product]:
        if self.products_df is None or self.products_df.empty:
            return None
            
        product_row = self.products_df[self.products_df['id'] == product_id]
        if product_row.empty:
            return None
            
        product_data = product_row.iloc[0].to_dict()
        
        specs = []
        if 'specs' in product_data and product_data['specs']:
            if isinstance(product_data['specs'], str):
                try:
                    specs_dict = json.loads(product_data['specs'])
                    specs = [
                        ProductSpec(key=k, value=v) 
                        for k, v in specs_dict.items()
                    ]
                except:
                    specs = []
            elif isinstance(product_data['specs'], dict):
                specs = [
                    ProductSpec(key=k, value=v) 
                    for k, v in product_data['specs'].items()
                ]
                
        return Product(
            id=product_data['id'],
            name=product_data['name'],
            price=float(product_data['price']) if 'price' in product_data else 0.0,
            image_url=product_data.get('image_url', ''),
            url=product_data.get('url', ''),
            specs=specs,
            category=product_data.get('category', ''),
            brand=product_data.get('brand', ''),
            description=product_data.get('description', '')
        )
    
    def search_products(self, query: str, limit: int = 5) -> List[Product]:
        if self.products_df is None or self.products_df.empty:
            return []
            
        query = query.lower()
        
        mask = (
            self.products_df['name'].str.lower().str.contains(query, na=False) |
            self.products_df['description'].str.lower().str.contains(query, na=False) |
            self.products_df['brand'].str.lower().str.contains(query, na=False) |
            self.products_df['category'].str.lower().str.contains(query, na=False)
        )
        
        matching_products = self.products_df[mask].head(limit)
        
        products = []
        for _, row in matching_products.iterrows():
            product_id = row['id']
            product = self.get_product_by_id(product_id)
            if product:
                products.append(product)
                
        return products
        
    def get_similar_products(self, product_id: str, limit: int = 3) -> List[Product]:
        if self.products_df is None or self.products_df.empty:
            return []
            
        product = self.get_product_by_id(product_id)
        if not product:
            return []
            
        mask = (
            (self.products_df['category'] == product.category) &
            (self.products_df['id'] != product_id)
        )
        
        similar_products_df = self.products_df[mask].head(limit)
        
        similar_products = []
        for _, row in similar_products_df.iterrows():
            similar_product_id = row['id']
            similar_product = self.get_product_by_id(similar_product_id)
            if similar_product:
                similar_products.append(similar_product)
                
        return similar_products
        
    def compare_products(self, product_ids: List[str]) -> List[Product]:
        products = []
        for product_id in product_ids:
            product = self.get_product_by_id(product_id)
            if product:
                products.append(product)
                
        return products

data_processor = DataProcessor() 