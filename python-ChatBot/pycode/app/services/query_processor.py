import re
import logging
from typing import List, Dict, Any, Optional, Tuple
from app.services.data_processor import data_processor
from app.models.schemas import Product

logger = logging.getLogger(__name__)

class QueryProcessor:
    def __init__(self):
        self.price_patterns = [
            r'dưới\s+(\d+)(\s*triệu)?',
            r'không\s+quá\s+(\d+)(\s*triệu)?',
            r'tối\s+đa\s+(\d+)(\s*triệu)?',
            r'khoảng\s+(\d+)(\s*triệu)?',
            r'từ\s+(\d+)\s*-\s*(\d+)(\s*triệu)?',
            r'(\d+)\s*-\s*(\d+)(\s*triệu)?',
            r'(\d+)\s*đến\s*(\d+)(\s*triệu)?',
            r'(\d+)\s*triệu'
        ]
        
        self.category_keywords = {
            'laptop': ['laptop', 'máy tính xách tay', 'notebook'],
            'laptop gaming': ['laptop gaming', 'gaming laptop', 'laptop chơi game'],
            'pc': ['pc', 'máy tính', 'máy bàn', 'case', 'thùng máy'],
            'pc gaming': ['pc gaming', 'máy tính chơi game', 'máy bàn gaming'],
            'màn hình': ['màn hình', 'monitor', 'display'],
            'bàn phím': ['bàn phím', 'keyboard', 'phím'],
            'chuột': ['chuột', 'mouse', 'con chuột'],
            'tai nghe': ['tai nghe', 'headphone', 'headset'],
            'linh kiện': ['linh kiện', 'phụ kiện', 'ssd', 'ram', 'card màn hình', 'vga', 'gpu', 'cpu']
        }
        
        self.brand_keywords = {
            'asus': ['asus', 'rog', 'tuf'],
            'acer': ['acer', 'predator', 'nitro'],
            'msi': ['msi', 'steelseries'],
            'apple': ['apple', 'macbook', 'mac'],
            'dell': ['dell', 'alienware', 'xps'],
            'hp': ['hp', 'omen', 'pavilion'],
            'lenovo': ['lenovo', 'legion', 'thinkpad'],
            'logitech': ['logitech', 'logi', 'g pro'],
            'hyperx': ['hyperx', 'kingston'],
            'akko': ['akko'],
            'samsung': ['samsung'],
            'lg': ['lg'],
            'corsair': ['corsair'],
            'gvn': ['gvn']
        }
        
        self.spec_keywords = {
            'cpu': ['cpu', 'vi xử lý', 'bộ xử lý', 'processor', 'chip', 'ryzen', 'intel', 'core i', 'i5', 'i7', 'i9'],
            'ram': ['ram', 'bộ nhớ', 'memory', 'ddr4', 'ddr5'],
            'storage': ['ssd', 'hdd', 'ổ cứng', 'ổ đĩa', 'lưu trữ', 'storage', 'nvme'],
            'gpu': ['gpu', 'card đồ họa', 'vga', 'card màn hình', 'rtx', 'gtx', 'nvidia', 'amd', 'radeon'],
            'display': ['màn hình', 'display', 'screen', 'panel', 'ips', 'oled', 'inch', '"', 'hz', 'tần số quét']
        }
        
        self.purpose_keywords = {
            'gaming': ['gaming', 'game', 'chơi game', 'fps', 'battle royale', 'moba', 'esport'],
            'văn phòng': ['văn phòng', 'office', 'word', 'excel', 'powerpoint', 'làm việc', 'nhẹ'],
            'đồ họa': ['đồ họa', 'thiết kế', 'design', 'photoshop', 'illustrator', 'premiere', 'after effects', 'render'],
            'lập trình': ['lập trình', 'coding', 'programming', 'developer', 'code', 'phát triển'],
            'học tập': ['học tập', 'sinh viên', 'student', 'học', 'nghiên cứu']
        }
    
    def _convert_to_million(self, price_str: str) -> float:
        try:
            return float(price_str)
        except ValueError:
            return 0
    
    def extract_price_range(self, query: str) -> Tuple[Optional[float], Optional[float]]:
        query = query.lower()
        
        query = re.sub(r'(\d+)[.,\s]+(\d+)', r'\1\2', query)
        
        min_price = None
        max_price = None
        
        for pattern in self.price_patterns:
            matches = re.search(pattern, query)
            if matches:
                groups = matches.groups()
                
                if pattern.startswith(r'dưới') or pattern.startswith(r'không') or pattern.startswith(r'tối'):
                    max_price = self._convert_to_million(groups[0])
                
                elif pattern.startswith(r'khoảng'):
                    price = self._convert_to_million(groups[0])
                    min_price = price * 0.8 
                    max_price = price * 1.2
                
                elif 'từ' in pattern or '-' in pattern or 'đến' in pattern:
                    min_price = self._convert_to_million(groups[0])
                    max_price = self._convert_to_million(groups[1])
                
                else:
                    price = self._convert_to_million(groups[0])
                    min_price = price * 0.9 
                    max_price = price * 1.1
                
                if len(groups) > 1 and groups[-1] and 'triệu' in groups[-1]:
                    if min_price is not None:
                        min_price = min_price * 1000000
                    if max_price is not None:
                        max_price = max_price * 1000000
                
                break
        
        return min_price, max_price
    
    def extract_categories(self, query: str) -> List[str]:
        query = query.lower()
        categories = []
        
        for category, keywords in self.category_keywords.items():
            for keyword in keywords:
                if keyword in query:
                    categories.append(category)
                    break
        
        return list(set(categories))
    
    def extract_brands(self, query: str) -> List[str]:
        query = query.lower()
        brands = []
        
        for brand, keywords in self.brand_keywords.items():
            for keyword in keywords:
                if keyword in query:
                    brands.append(brand)
                    break
        
        return list(set(brands))
    
    def extract_specs(self, query: str) -> Dict[str, List[str]]:
        query = query.lower()
        specs = {}
        
        for spec_type, keywords in self.spec_keywords.items():
            for keyword in keywords:
                if keyword in query:
                    pattern = r'(\w+\s+){0,3}' + re.escape(keyword) + r'(\s+\w+){0,3}'
                    matches = re.findall(pattern, query)
                    
                    if matches:
                        if spec_type not in specs:
                            specs[spec_type] = []
                        
                        for match in matches:
                            context = ''.join(match)
                            if context and context not in specs[spec_type]:
                                specs[spec_type].append(context.strip())
        
        return specs
    
    def extract_purposes(self, query: str) -> List[str]:
        query = query.lower()
        purposes = []
        
        for purpose, keywords in self.purpose_keywords.items():
            for keyword in keywords:
                if keyword in query:
                    purposes.append(purpose)
                    break
        
        return list(set(purposes))
    
    def analyze_query(self, query: str) -> Dict[str, Any]:
        min_price, max_price = self.extract_price_range(query)
        categories = self.extract_categories(query)
        brands = self.extract_brands(query)
        specs = self.extract_specs(query)
        purposes = self.extract_purposes(query)
        
        return {
            "price_range": {
                "min": min_price,
                "max": max_price
            },
            "categories": categories,
            "brands": brands,
            "specs": specs,
            "purposes": purposes,
            "original_query": query
        }
    
    def find_matching_products(self, analysis: Dict[str, Any], limit: int = 5) -> List[Product]:
        query_parts = []
        
        if analysis["categories"]:
            query_parts.extend(analysis["categories"])
        
        if analysis["brands"]:
            query_parts.extend(analysis["brands"])
        
        if analysis["purposes"]:
            query_parts.extend(analysis["purposes"])
        
        for spec_type, contexts in analysis["specs"].items():
            for context in contexts:
                query_parts.append(context)
        
        search_query = " ".join(query_parts)
        if not search_query:
            search_query = analysis["original_query"]
        
        products = data_processor.search_products(search_query, limit=limit)
        
        if analysis["price_range"]["min"] is not None or analysis["price_range"]["max"] is not None:
            filtered_products = []
            for product in products:
                if analysis["price_range"]["min"] is not None and product.price < analysis["price_range"]["min"]:
                    continue
                if analysis["price_range"]["max"] is not None and product.price > analysis["price_range"]["max"]:
                    continue
                filtered_products.append(product)
            products = filtered_products
        
        return products
    
    def process_natural_query(self, query: str, limit: int = 5) -> Tuple[List[Product], Dict[str, Any]]:
        analysis = self.analyze_query(query)
        products = self.find_matching_products(analysis, limit)
        return products, analysis

query_processor = QueryProcessor() 