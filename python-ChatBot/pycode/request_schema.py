from pydantic import BaseModel

class QueryRequest(BaseModel):
    model: str
    json_path: str
    query: str
