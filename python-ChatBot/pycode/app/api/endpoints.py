from fastapi import APIRouter, Form, UploadFile, File, HTTPException, Depends
from typing import List, Optional
import logging
from app.models.schemas import (
    QueryRequest, 
    QueryResponse, 
    ComparisonRequest, 
    ComparisonResult,
    Product,
    ResponseItem
)
from app.services.ai_service import ai_service
from app.services.data_processor import data_processor

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/test", tags=["Health"])
async def test_connection():
    return {"status": "ok", "message": "TechBot API is running"}

@router.get("/models", tags=["ChatBot"])
async def get_available_models():
    models = [
        {"id": "deepseek", "name": "DeepSeek-R1-Distill-Llama-70b", "description": "Mô hình mặc định"},
        {"id": "llama3", "name": "Llama-3.3-70b-Versatile", "description": "Mô hình mới nhất"},
        {"id": "gemma", "name": "Gemma2-9b-It", "description": "Mô hình nhỏ, nhanh"},
        {"id": "mistral", "name": "Mistral-Saba-24b", "description": "Mô hình cân bằng"},
        {"id": "qwen", "name": "Qwen-Qwq-32b", "description": "Mô hình đa ngôn ngữ"},
        {"id": "llama2", "name": "Llama-2-70b-chat", "description": "Mô hình ổn định"},
        {"id": "mixtral", "name": "Mixtral-8x7b-32768", "description": "Mô hình với context dài"}
    ]
    return {"models": models}

@router.post("/direct-query", tags=["ChatBot"])
async def direct_query(
    query: str = Form(...),
    model: str = Form("deepseek")
):
    logger.info(f"Received direct query: {query}, model: {model}")
    
    try:
        response_items = await ai_service.process_query(query, model)
        
        return {"response": response_items}
    except Exception as e:
        logger.error(f"Error processing direct query: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@router.post("/compare-products", tags=["Products"], response_model=ComparisonResult)
async def compare_products(request: ComparisonRequest):
    logger.info(f"Comparing products: {request.product_ids}")
    
    try:
        products = data_processor.compare_products(request.product_ids)
        
        comparison_text = await ai_service.compare_products(request.product_ids)
        
        return ComparisonResult(
            products=products,
            comparison_text=comparison_text
        )
    except Exception as e:
        logger.error(f"Error comparing products: {e}")
        raise HTTPException(status_code=500, detail=f"Error comparing products: {str(e)}")

@router.get("/products/search", tags=["Products"])
async def search_products(query: str, limit: int = 5):
    logger.info(f"Searching products with query: {query}, limit: {limit}")
    
    try:
        products = data_processor.search_products(query, limit)
        
        return {"products": products}
    except Exception as e:
        logger.error(f"Error searching products: {e}")
        raise HTTPException(status_code=500, detail=f"Error searching products: {str(e)}")

@router.get("/products/{product_id}", tags=["Products"], response_model=Optional[Product])
async def get_product(product_id: str):
    logger.info(f"Getting product with ID: {product_id}")
    
    try:
        product = data_processor.get_product_by_id(product_id)
        
        if not product:
            raise HTTPException(status_code=404, detail=f"Product with ID {product_id} not found")
        
        return product
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting product: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting product: {str(e)}")

@router.get("/products/{product_id}/similar", tags=["Products"])
async def get_similar_products(product_id: str, limit: int = 3):
    logger.info(f"Getting similar products for ID: {product_id}, limit: {limit}")
    
    try:
        similar_products = data_processor.get_similar_products(product_id, limit)
        
        return {"products": similar_products}
    except Exception as e:
        logger.error(f"Error getting similar products: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting similar products: {str(e)}")
