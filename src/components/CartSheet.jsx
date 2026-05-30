import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { db, firebaseReady } from '../lib/firebase'
import { cartWhatsApp } from '../lib/whatsapp'

export default function CartSheet() {
  const { items, removeItem, updateQty, clearCart, totalItems, totalPrice, sheetOpen, setSheetOpen } = useCart()
  const { user } = useAuth()

  async function handleConfirm() {
    // Open the tab synchronously so the popup isn't blocked after the await.
    const win = window.open('', '_blank')

    if (firebaseReady && db) {
      try {
        await addDoc(collection(db, 'orders'), {
          items: items.map(({ product, qty }) => ({
            id: product.id, name: product.name, price: product.price, qty,
          })),
          total: totalPrice,
          customer: {
            name: user?.name || 'Guest',
            email: user?.email || null,
            uid: user?.id || null,
          },
          status: 'pending',
          createdAt: serverTimestamp(),
        })
      } catch { /* still let the customer reach WhatsApp */ }
    }

    const url = cartWhatsApp(items)
    if (win) win.location.href = url
    else window.open(url, '_blank', 'noopener,noreferrer')

    clearCart()
    setSheetOpen(false)
  }

  return (
    <AnimatePresence>
      {sheetOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
            onClick={() => setSheetOpen(false)}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[80] bg-dp-card rounded-t-3xl border-t border-dp-border max-h-[85vh] flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-dp-border" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-dp-border shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-dp-gold" />
                <h2 className="font-display text-lg text-dp-cream">Your Cart</h2>
                {totalItems > 0 && (
                  <span className="font-body text-[11px] font-semibold bg-dp-gold text-white px-2 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-dp-border/40 flex items-center justify-center text-dp-muted hover:text-dp-cream transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Items list */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 py-10">
                <ShoppingBag size={40} className="text-dp-border" />
                <p className="font-body text-sm text-dp-muted text-center">Your cart is empty.</p>
                <Link
                  to="/shop"
                  onClick={() => setSheetOpen(false)}
                  className="font-body text-xs text-dp-gold border border-dp-gold/40 px-4 py-2 rounded-full hover:bg-dp-gold/10 transition-colors"
                >
                  Browse Fragrances
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
                  {items.map(({ product, qty }) => (
                    <div key={product.id} className="flex items-center gap-3 bg-dp-bg rounded-2xl p-3 border border-dp-border">
                      {/* colour swatch */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-display font-bold text-lg select-none"
                        style={{ background: `${product.placeholderColor}30`, color: `${product.placeholderColor}90` }}
                      >
                        {product.placeholderInitial}
                      </div>

                      {/* info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-sm text-dp-cream leading-snug truncate">{product.name}</p>
                        <p className="font-body text-xs text-dp-gold mt-0.5">
                          {(product.price / 1000).toFixed(0)}k UGX
                        </p>
                      </div>

                      {/* qty controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => updateQty(product.id, qty - 1)}
                          className="w-7 h-7 rounded-full border border-dp-border flex items-center justify-center text-dp-muted hover:border-dp-gold hover:text-dp-gold transition-colors"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="font-body text-sm text-dp-cream w-5 text-center">{qty}</span>
                        <button
                          onClick={() => updateQty(product.id, qty + 1)}
                          className="w-7 h-7 rounded-full border border-dp-border flex items-center justify-center text-dp-muted hover:border-dp-gold hover:text-dp-gold transition-colors"
                        >
                          <Plus size={11} />
                        </button>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-dp-muted hover:text-red-400 transition-colors ml-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer — total + CTA */}
                <div className="shrink-0 px-5 pt-3 pb-8 border-t border-dp-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-dp-muted">Total</span>
                    <span className="font-display text-xl text-dp-gold">
                      {totalPrice.toLocaleString('en-UG')} <span className="font-body text-xs text-dp-muted">UGX</span>
                    </span>
                  </div>
                  <button
                    onClick={handleConfirm}
                    className="w-full bg-dp-gold text-white font-body text-sm font-semibold tracking-widest uppercase py-4 rounded-2xl hover:bg-dp-gold-light transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    Confirm Order on WhatsApp
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
