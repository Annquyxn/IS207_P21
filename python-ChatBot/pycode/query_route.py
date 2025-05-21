from fastapi import APIRouter, HTTPException, Request, Form, Query
import os
import logging
import json
from typing import Optional
from pycode.query_chain import query_sqlite_db, extract_keyword, extract_price_limit
from pycode.request_schema import QueryRequest

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# DB_PATH is now just a placeholder since we're using JSON files
DB_PATH = "placeholder"

@router.get("/products")
async def get_products():
    return {"message": "Please use POST method to query products"}

@router.get("/test")
async def test_endpoint():
    """Simple test endpoint that always returns success"""
    logger.info("Test endpoint called")
    return {
        "status": "success",
        "message": "API is working!",
        "response": [
            {
                "name": "Test Product",
                "price": 1000000,
                "type": "Test Type",
                "vendor": "Test Vendor",
                "link": "https://example.com",
                "image": "https://example.com/image.jpg"
            }
        ]
    }

@router.post("/products")
async def query_products(request: Request):
    try:
        # Get the raw body content
        body_bytes = await request.body()
        logger.info(f"Raw request body bytes: {body_bytes}")
        
        if not body_bytes:
            logger.error("Empty request body")
            return {"response": [{"message": "Empty request body"}]}
        
        # Try to parse as JSON
        try:
            body_str = body_bytes.decode('utf-8')
            logger.info(f"Decoded request body: {body_str}")
            body = json.loads(body_str)
            logger.info(f"Parsed JSON body: {body}")
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {str(e)}")
            # Try to get form data
            form_data = await request.form()
            logger.info(f"Form data: {form_data}")
            body = dict(form_data)
        
        # Extract query and model from body
        query = body.get("query", "")
        model = body.get("model", "")
        
        if not query:
            logger.error("Missing query parameter")
            return {"response": [{"message": "Query parameter is required"}]}
        
        logger.info(f"Processing query: '{query}', model: '{model}'")
        
        # Extract search parameters
        keyword = extract_keyword(query)
        price_limit = extract_price_limit(query)
        
        logger.info(f"Extracted keyword: '{keyword}', price_limit: {price_limit}")

        try:
            response = query_sqlite_db(
                db_path=DB_PATH,
                keyword=keyword,
                price_limit=price_limit
            )
            logger.info(f"Query successful, found {len(response)} results")
            return {"response": response}
            
        except Exception as e:
            logger.error(f"Query error: {str(e)}")
            return {"response": [{"message": f"Error: {str(e)}"}]}
            
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return {"response": [{"message": f"Error processing request: {str(e)}"}]}

@router.post("/direct-query")
async def direct_query(query: str = Form(...), model: str = Form("deepseek")):
    logger.info(f"Direct query received: query='{query}', model='{model}'")
    
    try:
        # Extract search parameters
        keyword = extract_keyword(query)
        price_limit = extract_price_limit(query)
        
        logger.info(f"Extracted keyword: '{keyword}', price_limit: {price_limit}")

        response = query_sqlite_db(
            db_path=DB_PATH,
            keyword=keyword,
            price_limit=price_limit
        )
        logger.info(f"Query successful, found {len(response)} results")
        return {"response": response}
        
    except Exception as e:
        logger.error(f"Error in direct query: {str(e)}")
        return {"response": [{"message": f"Error: {str(e)}"}]}

@router.get("/debug")
async def debug_search(query: str = Query(None)):
    """Debug endpoint to test search functionality"""
    if not query:
        return {
            "status": "error",
            "message": "Missing query parameter",
            "example": "/debug?query=laptop gaming dưới 20 triệu"
        }
    
    logger.info(f"Debug search with query: {query}")
    
    # Extract search parameters
    keyword = extract_keyword(query)
    price_limit = extract_price_limit(query)
    
    logger.info(f"Extracted keyword: '{keyword}', price_limit: {price_limit}")
    
    try:
        response = query_sqlite_db(
            db_path=DB_PATH,
            keyword=keyword,
            price_limit=price_limit
        )
        
        # Add debug info to response
        return {
            "status": "success",
            "query": query,
            "parsed": {
                "keyword": keyword,
                "price_limit": price_limit,
                "price_formatted": f"{price_limit:,}đ" if price_limit else "None"
            },
            "result_count": len(response),
            "results": response
        }
    except Exception as e:
        logger.error(f"Error in debug search: {str(e)}")
        return {
            "status": "error",
            "message": str(e)
        }
