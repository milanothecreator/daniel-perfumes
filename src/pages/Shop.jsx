import { useState, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, X, Heart, ChevronRight, Check } from 'lucide-react'
import { doc, onSnapshot } from 'firebase/firestore'
import ProductCard from '../components/ProductCard'
import { categories } from '../data/products'
import { useProducts } from '../context/ProductsContext'
import { useCart } from '../context/CartContext'
import { useLikes } from '../context/LikesContext'
import { usePrivacy } from '../context/PrivacyContext'
import { useAuth } from '../context/AuthContext'
import { db, firebaseReady } from '../lib/firebase'

const BANNER_DEFAULT = {
  label: 'Exclusive',
  title: 'New Season\nArrivals',
  subtitle: 'Up to 15% off selected fragrances',
  ctaText: 'Shop Now',
  ctaLink: '/category/oriental',
  videoUrl: null,
  active: true,
}

const tabs = [{ slug: 'all', name: 'All', icon: '✦' }, ...categories]

// ── Horizontal-scroll New Arrivals card ───────────────────────────────────────
function ArrivalCard({ product }) {
  const cat = categories.find(c => c.slug === product.category)
  const { isLiked, toggleLike } = useLikes()
  const liked = isLiked(product.id)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  function handleAdd(e) {
    e.preventDefault()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 900)
  }

  return (
    <Link to={`/product/${product.id}`} className="shrink-0 w-44 bg-dp-card rounded-2xl overflow-hidden shadow-sm border border-dp-border block">
      {/* image */}
      <div
        className="relative h-36 flex items-center justify-center"
        style={{ background: `linear-gradient(145deg, ${product.placeholderColor}55, ${product.placeholderColor}22)` }}
      >
        <span className="font-display font-bold text-5xl select-none" style={{ color: `${product.placeholderColor}60` }}>
          {product.placeholderInitial}
        </span>
        {(product.images?.[0] || product.image) && (
          <img src={product.images?.[0] || product.image} alt="" className="absolute inset-0 w-full h-full object-cover"
            onError={e => { e.currentTarget.style.display = 'none' }} />
        )}
        <span className="absolute top-2.5 left-2.5 bg-dp-cream text-white font-body text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full">
          {cat?.name}
        </span>
        <button
          type="button"
          onClick={e => { e.preventDefault(); toggleLike(product.id) }}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-dp-card/80 backdrop-blur flex items-center justify-center shadow-sm"
        >
          <Heart size={13} className={liked ? 'fill-red-500 text-red-500' : 'text-dp-muted'} />
        </button>
      </div>

      {/* info */}
      <div className="p-3">
        <p className="font-body text-[10px] text-dp-muted mb-0.5" style={{ color: cat?.accent }}>Daniel Perfumes</p>
        <h3 className="font-display text-dp-cream text-sm leading-snug truncate">{product.name}</h3>
        <div className="flex items-center justify-between mt-2.5">
          <span className="font-body text-xs font-semibold text-dp-gold">{(product.price / 1000).toFixed(0)}k UGX</span>
          <button
            type="button"
            onClick={handleAdd}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold leading-none transition-colors ${added ? 'bg-green-500' : 'bg-dp-gold'}`}
          >
            {added ? <Check size={11} /> : '+'}
          </button>
        </div>
      </div>
    </Link>
  )
}

// ── Main Shop page ─────────────────────────────────────────────────────────────
export default function Shop() {
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch]       = useState('')
  const [banner, setBanner]       = useState(BANNER_DEFAULT)
  const tabsRef                   = useRef(null)
  const { user }                  = useAuth()
  const { products }              = useProducts()
  const { likedIds }              = useLikes()
  const { prefs }                 = usePrivacy()

  useEffect(() => {
    if (!firebaseReady || !db) return
    return onSnapshot(doc(db, 'adverts', 'banner'), snap => {
      if (snap.exists()) setBanner({ ...BANNER_DEFAULT, ...snap.data() })
    })
  }, [])

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchCat = activeTab === 'all' || p.category === activeTab
      const q = search.toLowerCase()
      const matchSearch = !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.notes.top.toLowerCase().includes(q) ||
        p.notes.heart.toLowerCase().includes(q) ||
        p.notes.base.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [activeTab, search, products])

  const newArrivals = useMemo(() => {
    if (!likedIds.size || !prefs.scentRecommendations) return products.slice(0, 6)
    const catScore = {}
    products.filter(p => likedIds.has(p.id)).forEach(p => {
      catScore[p.category] = (catScore[p.category] || 0) + 1
    })
    return products
      .filter(p => !likedIds.has(p.id))
      .sort((a, b) => (catScore[b.category] || 0) - (catScore[a.category] || 0))
      .slice(0, 6)
  }, [products, likedIds, prefs.scentRecommendations])

  return (
    <main className="min-h-screen bg-dp-bg pb-24">

      {/* ── Top greeting + search ── */}
      <div className="pt-20 pb-4 px-4 sm:px-6 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          {user ? (
            <>
              <p className="font-body text-sm text-dp-muted">Welcome back,</p>
              <h1 className="font-display text-2xl text-dp-cream">{user.name.split(' ')[0]}</h1>
            </>
          ) : (
            <>
              <p className="font-body text-sm text-dp-muted">Discover</p>
              <h1 className="font-display text-2xl text-dp-cream">Your Signature Scent</h1>
            </>
          )}
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dp-muted" />
          <input
            type="text"
            placeholder="Search fragrances, notes…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-dp-card border border-dp-border rounded-2xl pl-10 pr-10 py-3 font-body text-sm text-dp-cream placeholder-dp-muted focus:outline-none focus:border-dp-gold transition-colors shadow-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-dp-muted hover:text-dp-cream">
              <X size={15} />
            </button>
          )}
        </motion.div>
      </div>

      {/* ── Featured banner ── */}
      {banner.active && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mx-4 sm:mx-6 max-w-2xl sm:mx-auto mb-6 rounded-2xl overflow-hidden relative"
          style={!banner.videoUrl ? { background: 'linear-gradient(120deg, #1A1510 0%, #3A2A10 60%, #9A7520 100%)' } : {}}
        >
          {/* Video background */}
          {banner.videoUrl && (
            <>
              <video
                src={banner.videoUrl}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay muted loop playsInline
              />
              <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.45)' }} />
            </>
          )}

          {/* Sparkle dots — only shown when no video */}
          {!banner.videoUrl && (
            <>
              <div className="absolute top-4 right-20 w-1.5 h-1.5 rounded-full bg-dp-gold/60" />
              <div className="absolute top-8 right-32 w-1 h-1 rounded-full bg-dp-gold/40" />
              <div className="absolute bottom-6 right-16 w-2 h-2 rounded-full bg-dp-gold/30" />
            </>
          )}

          <div className="relative z-10 p-6 pr-28 sm:pr-36">
            <span className="inline-block font-body text-[10px] tracking-[0.3em] uppercase text-dp-gold mb-2">
              {banner.label}
            </span>
            <h2 className="font-display text-xl sm:text-2xl text-white leading-snug mb-1" style={{ whiteSpace: 'pre-line' }}>
              {banner.title}
            </h2>
            <p className="font-body text-xs text-white/60 mb-4">{banner.subtitle}</p>
            <Link
              to={banner.ctaLink}
              className="inline-flex items-center gap-1.5 bg-dp-gold text-white font-body text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full hover:bg-dp-gold-light transition-colors"
            >
              {banner.ctaText}
            </Link>
          </div>

          {/* Decorative letter — only shown when no video */}
          {!banner.videoUrl && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 font-display text-[80px] font-bold leading-none text-white/5 select-none pointer-events-none">
              D
            </div>
          )}
        </motion.div>
      )}

      {/* ── Category pills ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        ref={tabsRef}
        className="flex gap-2.5 px-4 sm:px-6 mb-6 overflow-x-auto pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tabs.map(tab => (
          <button
            key={tab.slug}
            onClick={() => setActiveTab(tab.slug)}
            className="relative shrink-0 flex items-center justify-center active:scale-95 transition-transform rotating-pill
              after:content-[''] after:block after:absolute after:inset-[2.5px] after:rounded-[24px] after:z-[1]
              after:bg-[var(--color-background)]"
            style={{
              height: 52,
              borderRadius: 26,
              minWidth: 100,
              '--r': '0deg',
              '--color-background': 'rgb(var(--dp-card))',
            }}
          >
            <span className="relative z-10 font-body text-sm font-medium tracking-wide px-5 text-dp-cream">
              {tab.name}
            </span>
          </button>
        ))}
      </motion.div>

      {/* ── New Arrivals horizontal scroll (only when not searching/filtering) ── */}
      {activeTab === 'all' && !search && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between px-4 sm:px-6 mb-4">
            <h2 className="font-display text-lg text-dp-cream flex items-center gap-2">
              {likedIds.size > 0 && prefs.scentRecommendations ? 'For You' : 'New Arrivals'}
              {likedIds.size > 0 && prefs.scentRecommendations && <Heart size={13} className="fill-red-400 text-red-400" />}
            </h2>
            <Link to="/shop" onClick={() => setActiveTab('all')} className="flex items-center gap-0.5 font-body text-xs text-dp-gold hover:text-dp-gold-light transition-colors">
              See all <ChevronRight size={13} />
            </Link>
          </div>
          <div
            className="flex gap-3.5 px-4 sm:px-6 overflow-x-auto pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {newArrivals.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}>
                <ArrivalCard product={product} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── All products grid ── */}
      <section className="px-4 sm:px-6 max-w-2xl sm:mx-auto">
        {activeTab !== 'all' ? (() => {
          const cat = tabs.find(t => t.slug === activeTab)
          return (
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-dp-card border border-dp-border shrink-0">
                {cat?.icon}
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-2xl text-dp-cream">{cat?.name}</h2>
                <p className="font-body text-[11px] text-dp-muted tracking-widest uppercase mt-0.5">
                  {filtered.length} Fragrance{filtered.length !== 1 ? 's' : ''}
                  {cat?.notes ? ` · ${cat.notes}` : ''}
                  {search ? ` · "${search}"` : ''}
                </p>
              </div>
            </div>
          )
        })() : (
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-dp-cream">All Fragrances</h2>
            <span className="font-body text-xs text-dp-muted">
              {filtered.length} item{filtered.length !== 1 ? 's' : ''}
              {search ? ` for "${search}"` : ''}
            </span>
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-3.5">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard product={product} compact />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-display text-4xl text-dp-border mb-3">✦</p>
            <p className="font-body text-dp-muted text-sm">No fragrances found. Try a different search.</p>
          </div>
        )}
      </section>
    </main>
  )
}
