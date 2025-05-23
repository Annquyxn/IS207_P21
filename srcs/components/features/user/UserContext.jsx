import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { useAuth } from "../auth/AuthContext";
import { getUserId as getSupabaseUserId } from "../products/apiProduct";
import { supabase } from "@/components/services/supabase";
import { toast } from "react-hot-toast";

const UserContext = createContext();

export function UserProvider({ children }) {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [userId, setUserId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [recentlyAddedItems, setRecentlyAddedItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isCartLoading, setIsCartLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUserInfo({
        fullName: user.user_metadata?.full_name || "",
        gender: user.user_metadata?.gender || "",
        phone: user.user_metadata?.phone || "",
        email: user.email,
        dob: user.user_metadata?.dob || { day: "", month: "", year: "" },
      });
      
      // Set user ID directly from auth context
      setUserId(user.id);
      
      // Fetch cart items when user is logged in
      fetchCartItems(user.id);
    } else {
      setUserInfo(null);
      setUserId(null);
      setCartItems([]);
      setCartCount(0);
    }
  }, [user]);

  // Function to get user ID (for consistency with apiProduct.js)
  const getUserId = async () => {
    // Return from state if available to avoid unnecessary Supabase calls
    if (userId) return userId;
    
    // Otherwise, use the function from apiProduct.js
    return await getSupabaseUserId();
  };

  // Fetch cart items from database or local storage
  const fetchCartItems = async (uid) => {
    if (!uid) return;
    
    setIsCartLoading(true);
    
    try {
      // Try to get cart items from Supabase
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, product:product_id(*)')
        .eq('user_id', uid);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        setCartItems(data);
        setCartCount(data.reduce((total, item) => total + (item.quantity || 1), 0));
      } else {
        // If no cart in database, check local storage
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          const parsedCart = JSON.parse(localCart);
          setCartItems(parsedCart);
          setCartCount(parsedCart.reduce((total, item) => total + (item.quantity || 1), 0));
          
          // Optionally sync local cart to database
          syncLocalCartToDatabase(uid, parsedCart);
        }
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      // Try to use local storage as fallback
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        const parsedCart = JSON.parse(localCart);
        setCartItems(parsedCart);
        setCartCount(parsedCart.reduce((total, item) => total + (item.quantity || 1), 0));
      }
    } finally {
      setIsCartLoading(false);
    }
  };

  // Sync local cart to database
  const syncLocalCartToDatabase = async (uid, localCartItems) => {
    if (!uid || !localCartItems || localCartItems.length === 0) return;
    
    try {
      // First clear any existing cart items
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', uid);
        
      // Then insert new items
      const cartItemsToInsert = localCartItems.map(item => ({
        user_id: uid,
        product_id: item.id,
        quantity: item.quantity || 1,
        created_at: new Date().toISOString()
      }));
      
      await supabase
        .from('cart_items')
        .insert(cartItemsToInsert);
        
      // Clear local storage cart after successful sync
      localStorage.removeItem('cart');
    } catch (error) {
      console.error("Error syncing local cart to database:", error);
      // Keep local cart as backup
    }
  };

  // Add item to cart
  const addToCart = useCallback(async (product, quantity = 1, showToast = true) => {
    if (!product) return;
    
    try {
      const uid = await getUserId();
      
      // If user is logged in, add to database
      if (uid) {
        // Check if item already exists in cart
        const existingItem = cartItems.find(item => 
          item.product_id === product.id || (item.product && item.product.id === product.id)
        );
        
        if (existingItem) {
          // Update quantity
          const newQuantity = (existingItem.quantity || 1) + quantity;
          const { error } = await supabase
            .from('cart_items')
            .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
            .eq('id', existingItem.id);
            
          if (error) throw error;
          
          // Update local state
          setCartItems(prev => prev.map(item => 
            item.id === existingItem.id 
              ? { ...item, quantity: newQuantity } 
              : item
          ));
        } else {
          // Add new item
          const { data, error } = await supabase
            .from('cart_items')
            .insert({
              user_id: uid,
              product_id: product.id,
              quantity: quantity,
              created_at: new Date().toISOString()
            })
            .select();
            
          if (error) throw error;
          
          // Update local state with the new item
          if (data && data[0]) {
            setCartItems(prev => [...prev, { ...data[0], product }]);
          }
        }
      } else {
        // If not logged in, use local storage
        const localCart = localStorage.getItem('cart');
        let updatedCart = [];
        
        if (localCart) {
          updatedCart = JSON.parse(localCart);
          const existingItemIndex = updatedCart.findIndex(item => item.id === product.id);
          
          if (existingItemIndex >= 0) {
            // Update quantity for existing item
            updatedCart[existingItemIndex].quantity = 
              (updatedCart[existingItemIndex].quantity || 1) + quantity;
          } else {
            // Add new item
            updatedCart.push({
              ...product,
              quantity: quantity
            });
          }
        } else {
          // Create new cart with this item
          updatedCart = [{ ...product, quantity: quantity }];
        }
        
        // Update local storage
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        // Update state
        setCartItems(updatedCart);
      }
      
      // Update cart count
      updateCartCount();
      
      // Add to recently added items
      addToRecentlyAdded(product);
      
      // Show toast notification if needed
      if (showToast) {
        toast.success(`Đã thêm ${quantity} ${product.title || 'sản phẩm'} vào giỏ hàng!`, {
          icon: '🛒',
          duration: 3000
        });
      }
      
      return true;
    } catch (error) {
      console.error("Error adding item to cart:", error);
      if (showToast) {
        toast.error("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.");
      }
      return false;
    }
  }, [cartItems]);

  // Add to recently added items
  const addToRecentlyAdded = (product) => {
    // Remove if exists already
    const updatedRecent = recentlyAddedItems.filter(item => 
      item.id !== product.id
    );
    
    // Add at the beginning (most recent)
    setRecentlyAddedItems([product, ...updatedRecent].slice(0, 5));
    
    // Also store in local storage for persistence
    localStorage.setItem('recentlyAddedItems', JSON.stringify([product, ...updatedRecent].slice(0, 5)));
  };

  // Update cart count
  const updateCartCount = () => {
    const newCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    setCartCount(newCount);
  };

  // Remove item from cart
  const removeFromCart = useCallback(async (itemId) => {
    try {
      const uid = await getUserId();
      
      if (uid) {
        // Remove from database
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId);
          
        if (error) throw error;
      } else {
        // Remove from local storage
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          const updatedCart = JSON.parse(localCart).filter(item => item.id !== itemId);
          localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
      }
      
      // Update local state
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      
      // Update cart count
      updateCartCount();
      
      toast.success("Sản phẩm đã được xóa khỏi giỏ hàng!");
      return true;
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Không thể xóa sản phẩm khỏi giỏ hàng. Vui lòng thử lại sau.");
      return false;
    }
  }, []);

  // Update item quantity in cart
  const updateCartItemQuantity = useCallback(async (itemId, quantity) => {
    if (quantity < 1) return removeFromCart(itemId);
    
    try {
      const uid = await getUserId();
      
      if (uid) {
        // Update in database
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: quantity, updated_at: new Date().toISOString() })
          .eq('id', itemId);
          
        if (error) throw error;
      } else {
        // Update in local storage
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          const updatedCart = JSON.parse(localCart).map(item => 
            item.id === itemId ? { ...item, quantity } : item
          );
          localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
      }
      
      // Update local state
      setCartItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ));
      
      // Update cart count
      updateCartCount();
      
      return true;
    } catch (error) {
      console.error("Error updating item quantity:", error);
      toast.error("Không thể cập nhật số lượng sản phẩm. Vui lòng thử lại sau.");
      return false;
    }
  }, [removeFromCart]);

  // Clear entire cart
  const clearCart = useCallback(async () => {
    try {
      const uid = await getUserId();
      
      if (uid) {
        // Clear from database
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', uid);
          
        if (error) throw error;
      }
      
      // Clear local storage cart
      localStorage.removeItem('cart');
      
      // Clear state
      setCartItems([]);
      setCartCount(0);
      
      return true;
    } catch (error) {
      console.error("Error clearing cart:", error);
      return false;
    }
  }, []);

  return (
    <UserContext.Provider value={{ 
      userInfo, 
      setUserInfo, 
      getUserId, 
      userId,
      cartItems,
      cartCount,
      isCartLoading,
      recentlyAddedItems,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      clearCart
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
