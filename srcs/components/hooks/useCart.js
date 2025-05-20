import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'

export function useCart() {
  const [cart, setCart] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMutating, setIsMutating] = useState(false)

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart')
      if (saved) setCart(JSON.parse(saved))
    } catch (error) {
      console.error('Error loading cart:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart, isLoading])

  // Add product to cart with mutation pattern
  const addToCart = useCallback((product, onSuccess) => {
    setIsMutating(true)
    
    setTimeout(() => { // simulate async operation
      try {
        setCart(prev => {
          const existing = prev.find(item => item.id === product.id)
          
          if (existing) {
            // Update existing product quantity
            const updated = prev.map(item => 
              item.id === product.id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            )
            
            // Call onSuccess callback if provided
            if (onSuccess) {
              onSuccess({
                cart: updated,
                updatedProduct: existing,
                action: 'update'
              })
            }
            
            return updated
          } else {
            // Add new product to cart
            const newProduct = { ...product, quantity: 1 }
            const updated = [...prev, newProduct]
            
            // Call onSuccess callback if provided
            if (onSuccess) {
              onSuccess({
                cart: updated,
                updatedProduct: newProduct,
                action: 'add'
              })
            }
            
            return updated
          }
        })
      } catch (error) {
        console.error('Error adding to cart:', error)
        toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng')
      } finally {
        setIsMutating(false)
      }
    }, 300) // small delay to simulate server operation
  }, [])

  // Remove product from cart
  const removeFromCart = useCallback((productId, onSuccess) => {
    setIsMutating(true)
    
    setTimeout(() => {
      try {
        const productToRemove = cart.find(item => item.id === productId)
        
        setCart(prev => {
          const updated = prev.filter(item => item.id !== productId)
          
          // Call onSuccess callback if provided
          if (onSuccess && productToRemove) {
            onSuccess({
              cart: updated,
              removedProduct: productToRemove
            })
          }
          
          return updated
        })
      } catch (error) {
        console.error('Error removing from cart:', error)
        toast.error('Có lỗi xảy ra khi xóa sản phẩm khỏi giỏ hàng')
      } finally {
        setIsMutating(false)
      }
    }, 300)
  }, [cart])

  // Update product quantity in cart
  const updateQuantity = useCallback((productId, quantity, onSuccess) => {
    if (quantity < 1) return
    setIsMutating(true)
    
    setTimeout(() => {
      try {
        setCart(prev => {
          const updated = prev.map(item => 
            item.id === productId 
              ? { ...item, quantity } 
              : item
          )
          
          const updatedProduct = updated.find(item => item.id === productId)
          
          // Call onSuccess callback if provided
          if (onSuccess && updatedProduct) {
            onSuccess({
              cart: updated,
              updatedProduct
            })
          }
          
          return updated
        })
      } catch (error) {
        console.error('Error updating cart quantity:', error)
        toast.error('Có lỗi xảy ra khi cập nhật số lượng')
      } finally {
        setIsMutating(false)
      }
    }, 300)
  }, [])

  // Clear the entire cart
  const clearCart = useCallback((onSuccess) => {
    setIsMutating(true)
    
    setTimeout(() => {
      try {
        setCart([])
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess({ cart: [] })
        }
      } catch (error) {
        console.error('Error clearing cart:', error)
        toast.error('Có lỗi xảy ra khi xóa giỏ hàng')
      } finally {
        setIsMutating(false)
      }
    }, 300)
  }, [])

  return { 
    cart, 
    isLoading, 
    isMutating,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  }
}