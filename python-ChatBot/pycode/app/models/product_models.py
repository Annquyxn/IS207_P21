from pydantic import BaseModel
from typing import Optional, List, Dict, Any

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

class ComparisonResult(BaseModel):
    products: List[Product]
    comparison_table: Dict[str, Dict[str, str]]
    recommendation: str