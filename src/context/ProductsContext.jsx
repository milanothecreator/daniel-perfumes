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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!firebaseReady || !db) return
    const unsub = onSnapshot(
      collection(db, 'products'),
      snap => {
        setLoading(false)
        if (snap.empty) return // keep seed data if collection not yet populated
        const staticMap = Object.fromEntries(seedProducts.map(p => [p.id, p]))
        // If Firestore has a broken image URL (old short-ID format), fall back to
        // the catalog image. Cloudinary uploads (contains 'cloudinary') are kept.
        const isGoodImage = url => url && (url.includes('cloudinary') || /photo-\d{10}/.test(url))
        setProducts(snap.docs.map(d => {
          const data = { id: d.id, ...d.data() }
          // Keep only working URLs; old short-ID Unsplash links are dead.
          let images = (data.images || []).filter(isGoodImage)
          if (!images.length && isGoodImage(data.image)) images = [data.image]
          if (!images.length && staticMap[data.id]?.image) images = [staticMap[data.id].image]
          data.images = images
          data.image = images[0] || null
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
      value={{ products, loading, getProductById, getProductsByCategory, getFeaturedProducts }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  return useContext(ProductsContext)
}
