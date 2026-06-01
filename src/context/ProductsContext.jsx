import { createContext, useContext, useState, useEffect } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db, firebaseReady } from '../lib/firebase'
import { products as seedProducts } from '../data/products'

const ProductsContext = createContext(null)

const FEATURED_IDS = ['w2', 'wm4', 'f4', 'o1']

export function ProductsProvider({ children }) {
  // Seed instantly with the static array so pages never flash empty,
  // then replace with live Firestore data once it arrives.
  const [products, setProducts] = useState(seedProducts)

  useEffect(() => {
    if (!firebaseReady || !db) return
    const unsub = onSnapshot(
      collection(db, 'products'),
      snap => {
        if (snap.empty) return // keep seed data if collection not yet populated
        const staticMap = Object.fromEntries(seedProducts.map(p => [p.id, p]))
        // If Firestore has a broken image URL (old short-ID format), fall back to
        // the catalog image. Cloudinary uploads (contains 'cloudinary') are kept.
        const isGoodImage = url => url && (url.includes('cloudinary') || /photo-\d{10}/.test(url))
        setProducts(snap.docs.map(d => {
          const data = { id: d.id, ...d.data() }
          if (!isGoodImage(data.image) && staticMap[data.id]?.image) {
            data.image = staticMap[data.id].image
          }
          // Normalize to images[] array for multi-image support
          if (!data.images?.length) {
            data.images = data.image ? [data.image] : []
          }
          return data
        }))
      },
      () => {} // on error, keep seed data
    )
    return unsub
  }, [])

  const getProductById = id => products.find(p => p.id === id)
  const getProductsByCategory = slug => products.filter(p => p.category === slug)
  const getFeaturedProducts = () =>
    FEATURED_IDS.map(id => products.find(p => p.id === id)).filter(Boolean)

  return (
    <ProductsContext.Provider
      value={{ products, getProductById, getProductsByCategory, getFeaturedProducts }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  return useContext(ProductsContext)
}
