import { useState } from 'react'
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Share2, Heart, ShoppingBag, Check } from 'lucide-react'
import { categories } from '../data/products'
import { useProducts } from '../context/ProductsContext'
import { useCart } from '../context/CartContext'
import { useLikes } from '../context/LikesContext'
import { useAuth } from '../context/AuthContext'

const TABS = ['Description', 'Scent Notes', 'Details']

export default function Product() {
  const { id }                     = useParams()
  const { products, getProductById } = useProducts()
  const product                    = getProductById(id)
  const { user }                   = useAuth()
  const navigate                   = useNavigate()
  const { addItem }                = useCart()
  const { isLiked, toggleLike }    = useLikes()
  const [activeTab, setActiveTab]  = useState(0)
  const [added, setAdded]          = useState(false)
  const [imgIdx, setImgIdx]        = useState(0)
  const [touchX, setTouchX]        = useState(null)

  if (!product) return <Navigate to="/shop" replace />

  const images  = product.images?.length ? product.images : product.image ? [product.image] : []
  const cat     = categories.find(c => c.slug === product.category)
  const liked   = isLiked(product.id)
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 8)
  const allNotes = [product.notes.top, product.notes.heart, product.notes.base].filter(Boolean).join(', ')
  const longevityIcon =
    product.longevity === 'Intense & lingering' ? '🌙' :
    product.longevity === 'All day' ? '☀️' : '🌤️'

  function handleAdd() {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  function onTouchStart(e) { setTouchX(e.touches[0].clientX) }
  function onTouchEnd(e) {
    if (touchX === null) return
    const dx = e.changedTouches[0].clientX - touchX
    if (dx < -40 && imgIdx < images.length - 1) setImgIdx(i => i + 1)
    if (dx >  40 && imgIdx > 0)                 setImgIdx(i => i - 1)
    setTouchX(null)
  }

  return (
    <main className="min-h-screen bg-dp-bg pt-16 pb-32">

      {/* ── Full-width hero image carousel ── */}
      <div
        className="relative h-64 sm:h-80 w-full overflow-hidden"
        style={{ background: product.placeholderColor + '33' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {images.length > 0 ? (
          <img
            key={imgIdx}
            src={images[imgIdx]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display font-bold text-[120px] leading-none select-none pointer-events-none"
              style={{ color: `${product.placeholderColor}25` }}>
              {product.placeholderInitial}
            </span>
          </div>
        )}
        {/* dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className={`h-1.5 rounded-full transition-all duration-200 ${i === imgIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/40'}`}
              />
            ))}
          </div>
        )}
        {/* fade to bg at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-dp-bg to-transparent" />
        {/* back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
        >
          <ArrowLeft size={17} className="text-white" />
        </button>
        {/* share */}
        <button
          onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
          className="absolute top-3 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
        >
          <Share2 size={15} className="text-white" />
        </button>
      </div>

      {/* ── Content ── */}
      <div className="px-4 sm:px-6 max-w-lg mx-auto">

        {/* Category + name + notes summary */}
        <div className="mt-1 mb-4">
          <p className="font-body text-[11px] tracking-[0.25em] uppercase mb-1.5 flex items-center gap-1.5"
            style={{ color: cat?.accent }}>
            {cat?.icon} {cat?.name}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-dp-cream leading-tight tracking-wide uppercase">
            {product.name}
          </h1>
          <p className="font-body text-xs text-dp-muted mt-1.5 leading-relaxed">{allNotes}</p>
        </div>

        {/* Price + size pill */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-baseline gap-1">
            <span className="font-body text-[11px] text-dp-muted uppercase tracking-widest">UGX</span>
            <span className="font-display text-2xl text-dp-cream">{product.price.toLocaleString('en-UG')}</span>
          </div>
          <span className="font-body text-xs text-dp-muted border border-dp-border rounded-full px-3 py-1 tracking-widest">
            {product.size?.toUpperCase() || '50ML'}
          </span>
        </div>

        {/* ── Tabs ── */}
        <div className="flex border-b border-dp-border mb-5">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`flex-1 pb-3 font-body text-[11px] tracking-widest uppercase transition-colors ${
                activeTab === i
                  ? 'text-dp-cream border-b-2 border-dp-cream -mb-px'
                  : 'text-dp-muted'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="mb-8 min-h-[80px]"
          >
            {activeTab === 0 && (
              <p className="font-body text-sm text-dp-muted leading-relaxed">{product.description}</p>
            )}

            {activeTab === 1 && (
              <div className="space-y-4">
                {[['Top', product.notes.top], ['Heart', product.notes.heart], ['Base', product.notes.base]].map(([label, value]) => (
                  <div key={label}>
                    <p className="font-body text-[10px] text-dp-gold uppercase tracking-widest mb-1">{label} Notes</p>
                    <p className="font-body text-sm text-dp-muted leading-relaxed">{value}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 2 && (
              <div className="divide-y divide-dp-border">
                {[
                  ['Category', `${cat?.icon ?? ''} ${cat?.name ?? ''}`.trim()],
                  ['Occasion', product.occasion],
                  ['Longevity', `${longevityIcon} ${product.longevity}`],
                  ['Size', product.size?.toUpperCase() || '50ML'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between py-3">
                    <span className="font-body text-xs text-dp-muted uppercase tracking-widest">{label}</span>
                    <span className="font-body text-sm text-dp-cream">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── You May Also Like ── */}
        {related.length > 0 && (
          <div className="mb-6">
            <h2 className="font-display text-xl text-dp-cream mb-4">You May Also Like</h2>
            <div
              className="flex gap-3 overflow-x-auto pb-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {related.map(p => <RelatedCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* ── Fixed bottom bar ── */}
      <div
        className="fixed left-0 right-0 z-40 px-4 flex items-center gap-3"
        style={{
          bottom: 'calc(66px)',
          paddingTop: '10px',
          paddingBottom: '10px',
          background: 'rgb(var(--dp-bg) / 0.92)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgb(var(--dp-border) / 0.5)',
        }}
      >
        <button
          onClick={() => toggleLike(product.id)}
          className="w-12 h-12 rounded-full border flex items-center justify-center shrink-0 transition-all"
          style={{
            borderColor: liked ? 'rgba(239,68,68,0.5)' : 'rgb(var(--dp-border))',
            background: liked ? 'rgba(239,68,68,0.08)' : 'transparent',
          }}
        >
          <Heart size={18} className={liked ? 'fill-red-500 text-red-500' : 'text-dp-muted'} />
        </button>

        <button
          onClick={handleAdd}
          className={`flex-1 h-12 rounded-full flex items-center justify-center gap-2.5 font-body text-sm font-semibold tracking-[0.15em] uppercase transition-all ${
            added ? 'bg-green-500 text-white' : 'bg-dp-cream text-dp-bg'
          }`}
        >
          {added ? <Check size={16} /> : <ShoppingBag size={16} />}
          {added ? 'Added to Bag!' : 'Add to Bag'}
        </button>
      </div>
    </main>
  )
}

function RelatedCard({ product }) {
  const cat = categories.find(c => c.slug === product.category)
  return (
    <Link
      to={`/product/${product.id}`}
      className="shrink-0 w-32 bg-dp-card border border-dp-border rounded-2xl overflow-hidden block active:scale-95 transition-transform"
    >
      <div
        className="h-28 flex items-center justify-center relative overflow-hidden"
        style={{ background: `linear-gradient(145deg, ${product.placeholderColor}44, ${product.placeholderColor}18)` }}
      >
        {product.image
          ? <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
          : <span className="font-display font-bold text-3xl select-none" style={{ color: `${product.placeholderColor}55` }}>{product.placeholderInitial}</span>}
      </div>
      <div className="p-2.5">
        <p className="font-display text-dp-cream text-xs leading-snug truncate">{product.name}</p>
        <p className="font-body text-[10px] text-dp-gold mt-0.5">{(product.price / 1000).toFixed(0)}k UGX</p>
      </div>
    </Link>
  )
}
