import sqlite3
import re

def extract_price_limit(query):
    price_match = re.search(r"(?:dưới|bé hơn|nhỏ hơn)?\s*(\d+([\.,]?\d+)*)\s*(nghìn|k|triệu|tr)?", query)
    if price_match:
        raw_value = price_match.group(1).replace(",", ".")
        try:
            price_num = float(raw_value)
            unit = price_match.group(3)
            if unit in ["triệu", "tr"]:
                return int(price_num * 1_000_000)
            elif unit in ["nghìn", "k"]:
                return int(price_num * 1_000)
            else:
                return int(price_num)
        except:
            return None
    return None

def extract_keyword(query):
    keyword = re.sub(r"(mua|bán|dưới|bé hơn|nhỏ hơn|\d+([\.,]?\d+)*\s*(nghìn|k|triệu|tr)?)", "", query)
    return keyword.strip().lower()

def query_sqlite_db(db_path: str, keyword: str = "", price_limit: int = None):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    query = "SELECT title, price, product_type, vendor, link, image FROM products WHERE 1=1"
    params = []

    if keyword:
        query += " AND LOWER(title) LIKE ?"
        params.append(f"%{keyword.lower()}%")

    if price_limit:
        query += " AND price <= ?"
        params.append(price_limit)

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    results = [
        {
            "name": r[0],
            "price": r[1],
            "type": r[2],
            "vendor": r[3],
            "link": r[4],
            "image": r[5]
        }
        for r in rows
    ]

    return results[:5] if results else [{"message": "Không tìm thấy sản phẩm phù hợp"}]