export async function fetchProducts() {
  const response = await fetch('https://api.example.com/products')
  return await response.json()
}

export async function placeOrder(orderData) {
  const response = await fetch('https://api.example.com/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  })
  return await response.json()
}