import { useState, useEffect } from 'react'

export function useCart() {
  const [cart, setCart] = useState([])

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      return existing 
        ? prev.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          )
        : [...prev, { ...product, quantity: 1 }]
    })
  }

  useEffect(() => {
    // Load cart from localStorage
    const saved = localStorage.getItem('cart')
    if (saved) setCart(JSON.parse(saved))
  }, [])

  useEffect(() => {
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  return { cart, addToCart }
}