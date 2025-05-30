from typing import List, Dict, Any, Optional, Union
from pydantic import BaseModel, Field

class ProductSpec(BaseModel):
    key: str
    value: str

class Product(BaseModel):
    id: str
    name: str
    price: float
    image_url: str
    url: str
    specs: List[ProductSpec] = []
    category: str = ""
    brand: str = ""
    description: str = ""
    
class ProductItem(BaseModel):
    type: str = "product"
    product: Product

class TextItem(BaseModel):
    type: str = "text"
    message: str

class ResponseItem(BaseModel):
    type: str
    message: Optional[str] = None
    product: Optional[Product] = None

class QueryRequest(BaseModel):
    query: str
    model: str = "deepseek"

class QueryResponse(BaseModel):
    response: List[ResponseItem]
    
class ComparisonRequest(BaseModel):
    product_ids: List[str]
    
class ComparisonResult(BaseModel):
    products: List[Product]
    comparison_text: str 