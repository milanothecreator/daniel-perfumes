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
            background: '#0D0A06',
            border: '1px solid rgba(154,117,32,0.2)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          }}
        >
          {/* aurora gradient zone — top ~45% of card */}
          <div
            className="absolute top-0 left-0 right-0 h-[170px] pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, #C8601A 0%, #D4930A 30%, #9A7520 55%, #5A3A10 80%, transparent 100%)',
              filter: 'blur(0px)',
            }}
          />
          {/* soft blur blobs inside the aurora for the mesh effect */}
          <div className="absolute top-0 left-0 right-0 h-[170px] pointer-events-none overflow-hidden">
            <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: 'rgba(220,140,20,0.55)', filter: 'blur(40px)', top: -40, left: -20 }} />
            <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', background: 'rgba(200,80,20,0.45)', filter: 'blur(50px)', top: -30, right: 10 }} />
            <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'rgba(180,120,10,0.35)', filter: 'blur(35px)', top: 30, left: '35%' }} />
          </div>
          {/* fade-to-dark transition */}
          <div
            className="absolute top-[120px] left-0 right-0 h-[80px] pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent, #0D0A06)' }}
          />

          {/* content */}
          <div className="relative z-10 pt-6 pb-7 px-6">
            {/* avatar-style icon centered at the aurora/dark boundary */}
            <div className="flex justify-start mb-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'rgba(13,10,6,0.75)',
                  border: '1.5px solid rgba(200,160,60,0.5)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                }}
              >
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect x="10" y="1" width="8" height="3" rx="1.5" fill="#C8A040" opacity="0.9"/>
                  <rect x="11.5" y="4" width="5" height="4" rx="1" fill="#C8A040" opacity="0.7"/>
                  <path d="M7 8 Q6 11 6 14 L6 23 Q6 27 14 27 Q22 27 22 23 L22 14 Q22 11 21 8 Z" fill="#C8A040" opacity="0.85"/>
                  <path d="M10 13 L10 22 Q10 25 14 25 Q18 25 18 22 L18 13 Z" fill="#C8A040" opacity="0.25"/>
                </svg>
              </div>
            </div>

            {/* tags row */}
            <div className="flex items-center gap-2 mb-3">
              <span className="font-body text-[9px] tracking-[0.35em] uppercase px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(154,117,32,0.18)', color: '#C8A040', border: '1px solid rgba(154,117,32,0.3)' }}>
                Personalised
              </span>
              <span className="font-body text-[9px] tracking-[0.35em] uppercase px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
                Free · 1 min
              </span>
            </div>

            <h2 className="font-display text-[1.6rem] text-dp-cream leading-snug mb-2">
              Find your<br />
              <span className="italic" style={{ color: '#D4A030' }}>signature scent</span>
            </h2>

            <p className="font-body text-dp-muted text-[11px] leading-relaxed mb-6 max-w-[220px]">
              Answer 6 quick questions and our AI matches you to the perfect fragrance.
            </p>

            {/* action row */}
            <div className="flex items-center gap-3">
              <Link
                to="/quiz"
                className="flex-1 flex items-center justify-center gap-2 font-body text-xs font-semibold tracking-widest uppercase text-white py-3 rounded-2xl transition-all"
                style={{
                  background: '#111',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
                }}
              >
                + Start the Quiz
              </Link>
              <button
                className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.5C8 1.5 3 5.5 3 9a5 5 0 0010 0C13 5.5 8 1.5 8 1.5z" stroke="rgba(154,117,32,0.7)" strokeWidth="1.2" fill="rgba(154,117,32,0.12)"/>
                </svg>
              </button>
              <button
                className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4.5A2.5 2.5 0 014.5 2h7A2.5 2.5 0 0114 4.5v7a2.5 2.5 0 01-2.5 2.5h-7A2.5 2.5 0 012 11.5v-7z" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" fill="none"/>
                  <path d="M5 8h6M8 5v6" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </section>

    </main>
  )
}
