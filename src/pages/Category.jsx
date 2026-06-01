import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import { ProductCardSkeleton } from '../components/SkeletonCard'
import { categories } from '../data/products'
import { useProducts } from '../context/ProductsContext'

export default function Category() {
  const { slug } = useParams()
  const category = categories.find(c => c.slug === slug)
  const { loading, getProductsByCategory } = useProducts()

  if (!category) return <Navigate to="/shop" replace />

  const products = getProductsByCategory(slug)

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <Link to="/shop" className="font-body text-xs text-dp-muted hover:text-dp-gold transition-colors">
            ← All Fragrances
          </Link>
        </motion.div>

        {/* Category Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden p-8 sm:p-12 mb-12"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.55) 0%, ${category.color}99 100%), url(/images/categories/${category.slug}.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: `1px solid ${category.accent}40`,
          }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{ background: `radial-gradient(ellipse at 20% 50%, ${category.accent}40, transparent 60%)` }}
          />
          <div className="relative flex items-center gap-6">
<div>
              <p className="font-body text-xs tracking-[0.4em] uppercase mb-2 text-white/90 drop-shadow">
                Scent Family
              </p>
              <h1 className="font-display text-4xl sm:text-5xl text-white mb-3">{category.name}</h1>
              <p className="font-body text-white/70 max-w-md leading-relaxed">{category.description}</p>
              <p className="font-body text-xs mt-3" style={{ color: category.accent }}>
                {products.length} fragrances available
              </p>
            </div>
          </div>
        </motion.div>

        {/* Products */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map(product => (
              <ProductCard key={product.id} product={product} compact />
            ))
          }
        </div>

        {/* Other categories */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="font-body text-xs text-dp-muted uppercase tracking-widest mb-6">Explore other families</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.filter(c => c.slug !== slug).map(c => (
              <Link
                key={c.slug}
                to={`/category/${c.slug}`}
                className="relative flex items-center justify-center active:scale-95 transition-transform rotating-pill
                  after:content-[''] after:block after:absolute after:inset-[2.5px] after:rounded-[24px] after:z-[1]
                  after:bg-[var(--color-background)]"
                style={{
                  height: 52,
                  borderRadius: 26,
                  minWidth: 120,
                  '--r': '0deg',
                  '--color-background': 'rgb(var(--dp-card))',
                }}
              >
                <span className="relative z-10 font-body text-sm font-medium tracking-wide px-5 text-dp-cream">{c.name}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  )
}
