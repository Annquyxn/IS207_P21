from pydantic import BaseModel

class QueryRequest(BaseModel):
    model: str
    query: str