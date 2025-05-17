import json
import sqlite3

# Load dữ liệu JSON
with open("gearvn_products.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Kết nối SQLite và tạo bảng
conn = sqlite3.connect("products.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    title TEXT,
    vendor TEXT,
    product_type TEXT,
    price INTEGER,
    link TEXT,
    image TEXT
)
""")

# Xoá dữ liệu cũ (nếu cần làm mới)
cursor.execute("DELETE FROM products")

# Chèn từng sản phẩm vào DB
for item in data:
    try:
        cursor.execute("""
            INSERT INTO products (id, title, vendor, product_type, price, link, image)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            item.get("id"),
            item.get("title"),
            item.get("vendor"),
            item.get("product_type"),
            int(item.get("price", "0").replace(".", "").replace(",", "")),
            item.get("link"),
            item.get("image", {}).get("src") if item.get("image") else None
        ))
    except Exception as e:
        print(f"Lỗi với sản phẩm {item.get('title')}: {e}")

conn.commit()
conn.close()

print("✅ Đã chuyển dữ liệu sang SQLite: products.db")
