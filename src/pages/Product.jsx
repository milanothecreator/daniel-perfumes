import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { categories } from '../data/products'
import { useProducts } from '../context/ProductsContext'
import { orderWhatsApp } from '../lib/whatsapp'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/ProductCard'

export default function Product() {
  const { id } = useParams()
  const { products, getProductById } = useProducts()
  const product = getProductById(id)
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!product) return <Navigate to="/shop" replace />

  const cat = categories.find(c => c.slug === product.category)
  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const longevityIcon =
    product.longevity === 'Intense & lingering' ? '🌙' :
    product.longevity === 'All day' ? '☀️' : '🌤️'

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <Link to="/shop" className="font-body text-xs text-dp-muted hover:text-dp-gold transition-colors">
            ← Back to Shop
          </Link>
        </motion.div>

        {/* Product hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-8 mb-14"
        >
          {/* Image */}
          <div
            className="relative rounded-3xl overflow-hidden h-72 sm:h-96 flex items-center justify-center"
            style={{ background: `linear-gradient(145deg, ${product.placeholderColor}, #FFFFFF)` }}
          >
            {product.image ? (
              <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <span className="font-display font-bold text-7xl sm:text-8xl text-dp-cream/10 select-none">
                {product.placeholderInitial}
              </span>
            )}
            <span
              className="absolute top-3 left-3 font-body text-xs tracking-widest uppercase px-3 py-1 rounded-full"
              style={{ background: `${cat?.accent}30`, color: cat?.accent, border: `1px solid ${cat?.accent}50` }}
            >
              {cat?.icon} {cat?.name}
            </span>
            <span className="absolute top-3 right-3 font-body text-xs text-dp-muted bg-dp-card/80 px-2 py-1 rounded-full">
              {longevityIcon} {product.longevity}
            </span>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <p className="font-body text-xs tracking-[0.3em] uppercase mb-2" style={{ color: cat?.accent }}>
              {cat?.name} · {product.occasion}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl text-dp-cream leading-tight mb-4">
              {product.name}
            </h1>
            <p className="font-body text-dp-muted leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Notes */}
            <div className="card-dark p-4 mb-6 space-y-3">
              <p className="font-body text-[10px] text-dp-gold uppercase tracking-widest mb-1">Fragrance Notes</p>
              <NoteRow label="Top" value={product.notes.top} />
              <NoteRow label="Heart" value={product.notes.heart} />
              <NoteRow label="Base" value={product.notes.base} />
            </div>

            {/* Price + CTA */}
            <div className="flex items-center gap-4">
              <div>
                <span className="font-display text-3xl text-dp-gold">
                  {product.price.toLocaleString('en-UG')}
                </span>
                <span className="font-body text-xs text-dp-muted ml-1">UGX</span>
              </div>
              {user ? (
                <a
                  href={orderWhatsApp(product.name, product.price)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold text-sm px-6 py-3"
                >
                  Order on WhatsApp
                </a>
              ) : (
                <button
                  onClick={() => navigate('/auth', { state: { from: `/product/${product.id}` } })}
                  className="btn-gold text-sm px-6 py-3"
                >
                  Sign in to Order
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Related products */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="font-body text-xs text-dp-muted uppercase tracking-widest mb-6">
              You may also like
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map(p => (
                <ProductCard key={p.id} product={p} compact />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}

function NoteRow({ label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="font-body text-[10px] text-dp-muted uppercase tracking-widest w-8 shrink-0 mt-0.5">{label}</span>
      <span className="font-body text-xs text-dp-muted/80 leading-relaxed">{value}</span>
    </div>
  )
}
