from fastapi import APIRouter
import os
from pycode.query_chain import query_sqlite_db, extract_keyword, extract_price_limit
from pycode.request_schema import QueryRequest

router = APIRouter()

DB_PATH = os.path.abspath("products.db")

@router.post("/products")
async def query_products(request: QueryRequest):
    keyword = extract_keyword(request.query)
    price_limit = extract_price_limit(request.query)

    response = query_sqlite_db(
        db_path=DB_PATH,
        keyword=keyword,
        price_limit=price_limit
    )
    return {"response": response}
