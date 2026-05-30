import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import LampHero from '../components/LampHero'
import { categories } from '../data/products'
import { useProducts } from '../context/ProductsContext'

export default function Home() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { getFeaturedProducts } = useProducts()
  const featured = getFeaturedProducts()

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
          <h2 className="font-display text-dp-cream text-lg">New Arrivals</h2>
          <Link to="/shop" className="font-body text-xs text-dp-gold">See all</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <ProductCard product={product} compact />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── QUIZ CTA ── */}
      <section className="px-4 pb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-3xl overflow-hidden border border-dp-gold/30 p-6 text-center"
          style={{ background: 'var(--dp-quiz-bg)' }}
        >
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, #9A752012, transparent 70%)' }} />
          <div className="relative">
            <p className="font-body text-dp-gold text-[10px] tracking-[0.4em] uppercase mb-3">Personalised For You</p>
            <h2 className="font-display text-2xl text-dp-cream mb-2">
              Not sure which scent is{' '}
              <span className="text-dp-gold italic">yours?</span>
            </h2>
            <p className="font-body text-dp-muted text-xs mb-5 max-w-xs mx-auto leading-relaxed">
              Take our 6-question quiz. Our AI matches you to your perfect fragrance.
            </p>
            <Link to="/quiz" className="btn-gold text-sm">Start the Quiz</Link>
          </div>
        </motion.div>
      </section>

    </main>
  )
}
