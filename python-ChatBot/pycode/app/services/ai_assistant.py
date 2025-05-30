from app.models.product_models import Product

class GroqAPI:
    def __init__(self, model_name):
        self.model_name = model_name

    def get_response(self, user_query: str, products: list[Product]) -> str:
        return f"Gợi ý cho: {user_query}, với {len(products)} sản phẩm."