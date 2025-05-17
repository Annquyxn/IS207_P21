import json
import os
from pathlib import Path
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import OllamaEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document

CATEGORIES = {
    "cpu-bo-vi-xu-ly": "CPU",
    "mainboard-bo-mach-chu": "Mainboard",
    "vga-card-man-hinh": "Card màn hình",
    "ram-pc": "RAM",
    "ssd-o-cung-the-ran": "SSD",
    "hdd-o-cung-pc": "HDD",
    "case-thung-may-tinh": "Case PC",
    "psu-nguon-may-tinh": "Nguồn máy tính",
    "tan-nhiet-nuoc": "Tản nhiệt CPU",
    "man-hinh-may-tinh": "Màn hình",
    "chuot-may-tinh": "Chuột gaming",
    "ban-phim-may-tinh": "Bàn phím",
    "tai-nghe-may-tinh": "Tai nghe gaming"
}

def load_multiple_json_to_documents(folder_path: str, categories: dict):
    documents = []
    for slug, name in categories.items():
        file_path = os.path.join(folder_path, f"{slug}.json")
        if not os.path.exists(file_path):
            continue
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        for item in data:
            content = json.dumps(item, ensure_ascii=False)
            documents.append(Document(page_content=content, metadata={"category": name}))
    return documents

def get_vector_store(folder_path: str, categories: dict):
    documents = load_multiple_json_to_documents(folder_path, categories)
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(documents)
    embedding = OllamaEmbeddings(model="deepseek-r1:latest")
    vectorstore = Chroma.from_documents(chunks, embedding=embedding)
    return vectorstore
