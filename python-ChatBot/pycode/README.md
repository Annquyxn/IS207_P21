# TechBot API

This is a FastAPI backend for the TechBot product recommendation system. It uses a CSV database of products to provide recommendations based on user queries.

## Setup

1. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Create a `.env` file with your GROQ API key:
   ```
   GROQ_API_KEY=your_api_key_here
   ```
   
   If you don't have a GROQ API key, you can get one from [https://console.groq.com/](https://console.groq.com/).

3. Ensure the CSV file `gearvn_products_transformed.csv` is in the same directory as `main.py`.

## Running the API

Run the FastAPI server:
```
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

## API Endpoints

- `GET /test` - Test if the API is running
- `POST /direct-query` - Send a product query (form data with fields: query, model)

## Frontend Integration

The React frontend should send requests to the API at `http://127.0.0.1:8000`.

Example query:
```javascript
const formData = new FormData();
formData.append("query", "Laptop dưới 15 triệu");
formData.append("model", "deepseek");

axios.post("http://127.0.0.1:8000/direct-query", formData)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });
```

## Customization

You can modify the product search algorithm in the `search_products` function in `main.py`. 