import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Check } from 'lucide-react'
import { categories } from '../data/products'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product, compact = false }) {
  const cat           = categories.find(c => c.slug === product.category)
  const { addItem, setSheetOpen } = useCart()
  const [liked, setLiked] = useState(false)
  const [added, setAdded] = useState(false)

  function handleAdd(e) {
    e.preventDefault()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 900)
  }

  if (compact) {
    // ── App-style compact card (used in Shop grid) ──────────────────────────
    return (
      <div className="bg-dp-card rounded-2xl overflow-hidden shadow-sm border border-dp-border flex flex-col">
        {/* image area */}
        <Link to={`/product/${product.id}`} className="block relative">
          <div
            className="relative h-40 flex items-center justify-center"
            style={{ background: `linear-gradient(145deg, ${product.placeholderColor}44, ${product.placeholderColor}18)` }}
          >
            {product.image ? (
              <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <span
                className="font-display font-bold text-5xl select-none"
                style={{ color: `${product.placeholderColor}70` }}
              >
                {product.placeholderInitial}
              </span>
            )}

            {/* category badge */}
            <span
              className="absolute top-2.5 left-2.5 font-body text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full"
              style={{ background: `${cat?.accent}18`, color: cat?.accent, border: `1px solid ${cat?.accent}35` }}
            >
              {cat?.icon} {cat?.name}
            </span>

            {/* heart */}
            <button
              type="button"
              onClick={e => { e.preventDefault(); setLiked(l => !l) }}
              className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-dp-card/80 backdrop-blur flex items-center justify-center shadow-sm transition-transform active:scale-90"
            >
              <Heart size={13} className={liked ? 'fill-red-500 text-red-500' : 'text-dp-muted'} />
            </button>
          </div>
        </Link>

        {/* info */}
        <div className="p-3 flex flex-col flex-1">
          <p className="font-body text-[10px] mb-0.5" style={{ color: cat?.accent }}>Daniel Perfumes</p>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-display text-dp-cream text-sm leading-snug line-clamp-2 hover:text-dp-gold transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center justify-between mt-auto pt-2.5">
            <div>
              <span className="font-body text-xs font-semibold text-dp-gold">
                {(product.price / 1000).toFixed(0)}k
              </span>
              <span className="font-body text-[9px] text-dp-muted ml-0.5">UGX</span>
            </div>
            <button
              onClick={handleAdd}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-base font-bold leading-none shadow-sm transition-all active:scale-95 ${added ? 'bg-green-500' : 'bg-dp-gold hover:bg-dp-gold-light'}`}
            >
              {added ? <Check size={14} /> : '+'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Full card (used in Quiz results, Product related, Home featured) ────────
  return (
    <div className="bg-dp-card rounded-2xl overflow-hidden shadow-sm border border-dp-border flex flex-col">
      {/* image */}
      <Link to={`/product/${product.id}`} className="block relative">
        <div
          className="relative h-52 flex items-center justify-center"
          style={{ background: `linear-gradient(145deg, ${product.placeholderColor}44, ${product.placeholderColor}18)` }}
        >
          {product.image ? (
            <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <span
              className="font-display font-bold text-6xl select-none"
              style={{ color: `${product.placeholderColor}70` }}
            >
              {product.placeholderInitial}
            </span>
          )}

          <span
            className="absolute top-3 left-3 font-body text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full"
            style={{ background: `${cat?.accent}18`, color: cat?.accent, border: `1px solid ${cat?.accent}35` }}
          >
            {cat?.icon} {cat?.name}
          </span>

          <button
            type="button"
            onClick={e => { e.preventDefault(); setLiked(l => !l) }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-dp-card/80 backdrop-blur flex items-center justify-center shadow-sm transition-transform active:scale-90"
          >
            <Heart size={15} className={liked ? 'fill-red-500 text-red-500' : 'text-dp-muted'} />
          </button>

          {/* longevity */}
          <span className="absolute bottom-2 right-3 text-base">
            {product.longevity === 'Intense & lingering' ? '🌙' : product.longevity === 'All day' ? '☀️' : '🌤️'}
          </span>
        </div>
      </Link>

      {/* info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="font-body text-[10px] mb-0.5" style={{ color: cat?.accent }}>Daniel Perfumes</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-dp-cream text-base leading-snug hover:text-dp-gold transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="font-body text-xs text-dp-muted mt-1 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-dp-border">
          <div>
            <span className="font-display text-dp-gold text-lg">
              {product.price.toLocaleString('en-UG')}
            </span>
            <span className="font-body text-[10px] text-dp-muted ml-1">UGX</span>
          </div>
          <button
            onClick={handleAdd}
            className={`font-body text-[11px] font-semibold tracking-widest uppercase px-4 py-2 rounded-full transition-all active:scale-95 ${added ? 'bg-green-500 text-white' : 'bg-dp-gold text-white hover:bg-dp-gold-light'}`}
          >
            {added ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
