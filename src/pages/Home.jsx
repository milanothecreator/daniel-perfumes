import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { ProductCardSkeleton } from '../components/SkeletonCard'
import LampHero from '../components/LampHero'
import { categories } from '../data/products'
import { useProducts } from '../context/ProductsContext'
import { useLikes } from '../context/LikesContext'
import { usePrivacy } from '../context/PrivacyContext'

export default function Home() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { products, loading, getFeaturedProducts } = useProducts()
  const { likedIds } = useLikes()
  const { prefs } = usePrivacy()

  const featured = useMemo(() => {
    if (!likedIds.size || !prefs.scentRecommendations) return getFeaturedProducts()
    const catScore = {}
    products.filter(p => likedIds.has(p.id)).forEach(p => {
      catScore[p.category] = (catScore[p.category] || 0) + 1
    })
    return products
      .filter(p => !likedIds.has(p.id))
      .sort((a, b) => (catScore[b.category] || 0) - (catScore[a.category] || 0))
      .slice(0, 4)
  }, [products, likedIds, prefs.scentRecommendations])

  function handleSearch(e) {
    e.preventDefault()
    navigate('/shop')
  }

  return (
    <main className="min-h-screen pt-16 pb-24 md:pb-0">

      {/* ── SEARCH BAR ── */}
      <section className="px-4 pt-5 pb-3">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <svg className="absolute left-3.5 w-4 h-4 text-dp-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search fragrances..."
            className="w-full bg-dp-card border border-dp-border rounded-2xl pl-10 pr-12 py-3 font-body text-sm text-dp-cream placeholder:text-dp-muted focus:outline-none focus:border-dp-gold/50 transition-colors"
          />
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="absolute right-3 p-1.5 rounded-lg hover:bg-dp-border/50 transition-colors"
            aria-label="Filter"
          >
            <svg className="w-4 h-4 text-dp-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
          </button>
        </form>
      </section>

      {/* ── LAMP HERO BANNER ── */}
      <LampHero />

      {/* ── CATEGORIES — horizontal pill cards ── */}
      <section className="pb-5">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="font-display text-dp-cream text-lg">Categories</h2>
          <Link to="/shop" className="font-body text-xs text-dp-gold">See all</Link>
        </div>
        <div
          className="flex gap-3 px-4 pb-1 overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="shrink-0"
            >
              <Link
                to={`/category/${cat.slug}`}
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
                <span className="relative z-10 font-body text-sm font-medium text-dp-cream tracking-wide px-5">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── NEW ARRIVALS — 2-column grid ── */}
      <section className="px-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-dp-cream text-lg flex items-center gap-2">
              {likedIds.size > 0 && prefs.scentRecommendations ? 'For You' : 'New Arrivals'}
              {likedIds.size > 0 && prefs.scentRecommendations && <Heart size={13} className="fill-red-400 text-red-400" />}
            </h2>
          <Link to="/shop" className="font-body text-xs text-dp-gold">See all</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : featured.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <ProductCard product={product} compact />
              </motion.div>
            ))
          }
        </div>
      </section>

      {/* ── QUIZ CTA ── */}
      <section className="px-4 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0D0A06 0%, #1C1408 40%, #2A1D08 70%, #1A1008 100%)',
            border: '1px solid rgba(154,117,32,0.35)',
            boxShadow: '0 0 40px rgba(154,117,32,0.08), inset 0 1px 0 rgba(154,117,32,0.15)',
          }}
        >
          {/* layered glow gradients */}
          <div className="absolute inset-0 pointer-events-none">
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(154,117,32,0.18), transparent 65%)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 85% 10%, rgba(200,160,60,0.12), transparent 55%)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 40% 40% at 90% 90%, rgba(154,117,32,0.08), transparent 50%)' }} />
          </div>

          {/* sparkle dots */}
          <div className="absolute top-5 left-8 w-1 h-1 rounded-full bg-dp-gold/50" />
          <div className="absolute top-10 left-16 w-0.5 h-0.5 rounded-full bg-dp-gold/30" />
          <div className="absolute top-3 right-36 w-1.5 h-1.5 rounded-full bg-dp-gold/25" />
          <div className="absolute bottom-8 left-10 w-1 h-1 rounded-full bg-dp-gold/20" />
          <div className="absolute bottom-12 left-24 w-0.5 h-0.5 rounded-full bg-white/20" />

          {/* decorative bottle silhouette */}
          <div className="absolute right-0 top-0 bottom-0 w-44 pointer-events-none select-none overflow-hidden">
            <svg viewBox="0 0 160 280" fill="none" xmlns="http://www.w3.org/2000/svg"
              className="absolute right-[-20px] top-1/2 -translate-y-1/2 h-[260px] w-auto opacity-[0.07]">
              <rect x="52" y="2" width="56" height="14" rx="4" fill="#9A7520"/>
              <rect x="60" y="16" width="40" height="20" rx="3" fill="#9A7520"/>
              <path d="M44 36 Q40 50 38 70 L38 240 Q38 258 80 258 Q122 258 122 240 L122 70 Q120 50 116 36 Z" fill="#9A7520"/>
              <path d="M55 80 L55 220 Q55 235 80 235 Q105 235 105 220 L105 80 Z" fill="#9A7520" opacity="0.4"/>
              <rect x="65" y="100" width="30" height="1.5" rx="1" fill="#9A7520" opacity="0.6"/>
              <rect x="62" y="115" width="36" height="1" rx="1" fill="#9A7520" opacity="0.4"/>
              <text x="80" y="170" textAnchor="middle" fontFamily="serif" fontSize="11" fill="#9A7520" opacity="0.8">Daniel</text>
              <text x="80" y="185" textAnchor="middle" fontFamily="serif" fontSize="7" fill="#9A7520" opacity="0.6">PERFUMES</text>
            </svg>
          </div>

          {/* content */}
          <div className="relative z-10 p-7 pr-32">
            {/* label with line */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-6 bg-dp-gold/50" />
              <p className="font-body text-[9px] tracking-[0.45em] uppercase text-dp-gold/80">Personalised For You</p>
            </div>

            <h2 className="font-display text-3xl text-dp-cream leading-tight mb-3">
              Find your<br />
              <span className="italic" style={{ color: '#C8A040' }}>signature scent</span>
            </h2>

            <p className="font-body text-dp-muted text-[11px] leading-relaxed mb-6 max-w-[200px]">
              6 questions. Our AI matches you to the perfect fragrance.
            </p>

            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 font-body text-xs font-semibold tracking-widest uppercase text-white px-5 py-2.5 rounded-full transition-all"
              style={{
                background: 'linear-gradient(135deg, #9A7520 0%, #C8A040 50%, #9A7520 100%)',
                backgroundSize: '200% 100%',
                boxShadow: '0 4px 20px rgba(154,117,32,0.4), 0 1px 0 rgba(255,255,255,0.1) inset',
              }}
            >
              Start the Quiz
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          {/* bottom shimmer line */}
          <div className="absolute bottom-0 left-8 right-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(154,117,32,0.4), transparent)' }} />
        </motion.div>
      </section>

    </main>
  )
}
