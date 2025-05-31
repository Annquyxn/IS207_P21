import os
import logging
import json
from typing import List, Dict, Any, Optional, Tuple
import groq
from pathlib import Path
from app.models.schemas import Product, ResponseItem, TextItem, ProductItem
from app.services.data_processor import data_processor
from app.services.query_processor import query_processor

logger = logging.getLogger(__name__)

# Thiết lập API key trực tiếp
GROQ_API_KEY = "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"
if not GROQ_API_KEY:
    logger.warning("GROQ_API_KEY not found in environment variables")

class AIService:
    def __init__(self):
        self.client = None
        if GROQ_API_KEY:
            # Sử dụng API trực tiếp thay vì Client object cho phiên bản 0.3.0
            os.environ["GROQ_API_KEY"] = GROQ_API_KEY
            self.client = True  # Đánh dấu là đã có API key
            logger.info("Groq API key set successfully")
        else:
            logger.error("Failed to initialize Groq client - missing API key")
    
    def _get_model_name(self, model: str) -> str:
        # Các model ID chính xác từ Groq API
        model_map = {
            "llama3": "llama3-70b-8192",
            "llama2": "llama2-70b-chat",
            "mixtral": "mixtral-8x7b-32768",
            "gemma": "gemma2-9b-it",
            "qwen": "qwen-qwq-32b",
            "deepseek": "deepseek-r1-distill-llama-70b",
            "mistral": "mistral-saba-24b"
        }
        model_id = model_map.get(model, "llama3-70b-8192")
        logger.info(f"Selected model: {model} -> {model_id}")
        return model_id
    
    async def process_query(self, query: str, model: str = "deepseek") -> List[ResponseItem]:
        if not self.client:
            logger.error("Groq client not initialized - missing API key")
            return [TextItem(message="Xin lỗi, dịch vụ AI hiện không khả dụng. Vui lòng thử lại sau.")]
        
        try:
            model_name = self._get_model_name(model)
            logger.info(f"Processing query with model: {model_name}")
            
            # Sử dụng query_processor để phân tích câu hỏi tự nhiên
            relevant_products, query_analysis = query_processor.process_natural_query(query, limit=3)
            
            # Log phân tích câu hỏi
            logger.info(f"Query analysis: {json.dumps(query_analysis, ensure_ascii=False, default=str)}")
            
            # Chuẩn bị context sản phẩm cho AI
            product_context = ""
            if relevant_products:
                for i, product in enumerate(relevant_products, 1):
                    specs_text = ", ".join([f"{spec.key}: {spec.value}" for spec in product.specs])
                    product_context += f"Sản phẩm {i}: {product.name}, Giá: {product.price:,.0f}đ, Thông số: {specs_text}\n"
            
            # Chuẩn bị context phân tích câu hỏi
            analysis_context = ""
            if query_analysis["categories"]:
                analysis_context += f"Danh mục: {', '.join(query_analysis['categories'])}\n"
            if query_analysis["brands"]:
                analysis_context += f"Thương hiệu: {', '.join(query_analysis['brands'])}\n"
            if query_analysis["purposes"]:
                analysis_context += f"Mục đích sử dụng: {', '.join(query_analysis['purposes'])}\n"
            if query_analysis["price_range"]["min"] is not None or query_analysis["price_range"]["max"] is not None:
                min_price = f"{int(query_analysis['price_range']['min']/1000000):,} triệu" if query_analysis["price_range"]["min"] is not None else "không giới hạn"
                max_price = f"{int(query_analysis['price_range']['max']/1000000):,} triệu" if query_analysis["price_range"]["max"] is not None else "không giới hạn"
                analysis_context += f"Khoảng giá: từ {min_price} đến {max_price}\n"
            
            # Chuẩn bị prompt cho AI
            prompt = f"""Bạn là TechBot, một trợ lý tư vấn sản phẩm công nghệ chuyên nghiệp của GearVN.
            
            Người dùng hỏi: {query}
            
            Phân tích câu hỏi:
            {analysis_context}
            
            Thông tin sản phẩm có sẵn:
            {product_context if product_context else "Không tìm thấy sản phẩm phù hợp."}
            
            Hãy trả lời câu hỏi của người dùng một cách chuyên nghiệp, ngắn gọn và đầy đủ thông tin.
            Nếu không có thông tin về sản phẩm cụ thể, hãy đề xuất tiêu chí chung để người dùng tham khảo.
            Nếu có sản phẩm phù hợp, hãy giải thích tại sao sản phẩm đó phù hợp với nhu cầu của người dùng.
            """
            
            logger.info("Sending request to Groq API")
            
            # Sử dụng groq.Completion.create thay vì client.chat.completions.create
            chat_completion = groq.Completion.create(
                model=model_name,
                prompt=f"System: Bạn là TechBot, trợ lý tư vấn sản phẩm công nghệ chuyên nghiệp.\n\nUser: {prompt}",
                temperature=0.7,
                max_tokens=1000,
            )
            
            # Điều chỉnh cách truy cập kết quả
            ai_response = chat_completion.choices[0].text
            logger.info("Received response from Groq API")
            
            response_items = [TextItem(message=ai_response)]
            
            for product in relevant_products:
                response_items.append(ProductItem(product=product))
            
            return response_items
            
        except Exception as e:
            logger.error(f"Error processing query: {e}")
            return [TextItem(message="Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.")]
    
    async def compare_products(self, product_ids: List[str], model: str = "deepseek") -> str:
        if not self.client:
            logger.error("Groq client not initialized - missing API key")
            return "Xin lỗi, dịch vụ AI hiện không khả dụng. Vui lòng thử lại sau."
            
        try:
            products = data_processor.compare_products(product_ids)
            if not products or len(products) < 2:
                return "Cần ít nhất 2 sản phẩm để so sánh."
                
            product_context = ""
            for i, product in enumerate(products, 1):
                specs_text = "\n".join([f"- {spec.key}: {spec.value}" for spec in product.specs])
                product_context += f"Sản phẩm {i}: {product.name}\nGiá: {product.price:,.0f}đ\nThông số:\n{specs_text}\n\n"
            
            prompt = f"""Bạn là TechBot, một trợ lý tư vấn sản phẩm công nghệ chuyên nghiệp của GearVN.
            
            Hãy so sánh các sản phẩm sau một cách khách quan, chi tiết và dễ hiểu:
            
            {product_context}
            
            Phân tích ưu, nhược điểm của từng sản phẩm và đưa ra lời khuyên cho người dùng nên chọn sản phẩm nào phù hợp với nhu cầu nào.
            """
            
            model_name = self._get_model_name(model)
            logger.info(f"Comparing products with model: {model_name}")
            
            # Sử dụng groq.Completion.create thay vì client.chat.completions.create
            chat_completion = groq.Completion.create(
                model=model_name,
                prompt=f"System: Bạn là TechBot, trợ lý tư vấn sản phẩm công nghệ chuyên nghiệp.\n\nUser: {prompt}",
                temperature=0.7,
                max_tokens=1500,
            )
            
            # Điều chỉnh cách truy cập kết quả
            comparison_text = chat_completion.choices[0].text
            logger.info("Received comparison response from Groq API")
            return comparison_text
            
        except Exception as e:
            logger.error(f"Error comparing products: {e}")
            return "Xin lỗi, đã xảy ra lỗi khi so sánh sản phẩm. Vui lòng thử lại sau."

ai_service = AIService() 