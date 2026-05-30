import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dp_cart') || '[]') }
    catch { return [] }
  })
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('dp_cart', JSON.stringify(items))
  }, [items])

  function addItem(product) {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { product, qty: 1 }]
    })
  }

  function removeItem(id) {
    setItems(prev => prev.filter(i => i.product.id !== id))
  }

  function updateQty(id, qty) {
    if (qty < 1) { removeItem(id); return }
    setItems(prev => prev.map(i => i.product.id === id ? { ...i, qty } : i))
  }

  function clearCart() { setItems([]) }

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice, sheetOpen, setSheetOpen }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() { return useContext(CartContext) }
