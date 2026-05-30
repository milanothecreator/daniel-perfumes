import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useCart } from '../context/CartContext'

const mobileLinks = [
  { to: '/',                  label: 'Home' },
  { to: '/shop',              label: 'Shop' },
  { to: '/category/woody',    label: 'Woody' },
  { to: '/category/warm',     label: 'Warm' },
  { to: '/category/fresh',    label: 'Fresh' },
  { to: '/category/oriental', label: 'Oriental' },
  { to: '/quiz',              label: 'Find My Scent' },
  { to: '/about',             label: 'About' },
]

export default function Navbar() {
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location                = useLocation()
  const { user, signOut }       = useAuth()
  const { dark, toggle }        = useTheme()
  const { totalItems, setSheetOpen } = useCart()

  useEffect(() => { setOpen(false) }, [location])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${scrolled ? 'bg-dp-bg/95 backdrop-blur-md border-b border-dp-border' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex flex-col leading-none">
          <span className="font-display text-xl text-dp-gold tracking-wide">Daniel</span>
          <span className="font-body text-[10px] tracking-[0.3em] text-dp-muted uppercase">Perfumes</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" end className={({ isActive }) => `font-body text-sm tracking-wide transition-colors ${isActive ? 'text-dp-gold' : 'text-dp-muted hover:text-dp-cream'}`}>Home</NavLink>
          <NavLink to="/shop" className={({ isActive }) => `font-body text-sm tracking-wide transition-colors ${isActive ? 'text-dp-gold' : 'text-dp-muted hover:text-dp-cream'}`}>Shop</NavLink>

          {/* Categories dropdown */}
          <div className="relative group">
            <button className="font-body text-sm tracking-wide text-dp-muted hover:text-dp-cream transition-colors flex items-center gap-1">
              Categories
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className="absolute top-full left-0 mt-2 w-40 bg-dp-card border border-dp-border rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-2xl">
              {['woody','warm','fresh','oriental'].map(slug => (
                <NavLink key={slug} to={`/category/${slug}`}
                  className={({ isActive }) => `block px-4 py-3 font-body text-sm capitalize transition-colors ${isActive ? 'text-dp-gold bg-dp-border/30' : 'text-dp-muted hover:text-dp-cream hover:bg-dp-border/20'}`}>
                  {slug}
                </NavLink>
              ))}
            </div>
          </div>

          <NavLink to="/quiz" className={({ isActive }) => `font-body text-sm transition-colors ${isActive ? 'text-dp-gold' : 'text-dp-muted hover:text-dp-cream'}`}>Find My Scent</NavLink>

          {/* Account — desktop */}
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 font-body text-sm text-dp-muted hover:text-dp-cream transition-colors">
                <div className="w-7 h-7 rounded-full bg-dp-gold/20 border border-dp-gold/50 flex items-center justify-center">
                  <span className="font-body text-[10px] text-dp-gold font-bold">{user.initials.slice(0,1)}</span>
                </div>
                {user.name.split(' ')[0]}
              </button>
              <div className="absolute top-full right-0 mt-2 w-44 bg-dp-card border border-dp-border rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-2xl">
                <NavLink to="/profile" className="block px-4 py-3 font-body text-sm text-dp-muted hover:text-dp-cream hover:bg-dp-border/20 transition-colors">My Profile</NavLink>
                <button onClick={signOut} className="w-full text-left px-4 py-3 font-body text-sm text-red-400 hover:bg-dp-border/20 transition-colors">Sign Out</button>
              </div>
            </div>
          ) : (
            <NavLink to="/auth" className={({ isActive }) => `font-body text-sm transition-colors ${isActive ? 'text-dp-gold' : 'text-dp-muted hover:text-dp-cream'}`}>Sign In</NavLink>
          )}

          {/* Theme toggle — desktop */}
          <button onClick={toggle} className="p-1.5 rounded-lg text-dp-muted hover:text-dp-cream transition-colors" aria-label="Toggle theme">
            {dark ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </nav>

        {/* Cart icon — mobile */}
        <button
          onClick={() => setSheetOpen(true)}
          className="md:hidden relative p-2 text-dp-muted hover:text-dp-cream transition-colors"
          aria-label="Cart"
        >
          <ShoppingBag size={20} />
          {totalItems > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-dp-gold text-white font-body text-[9px] font-bold flex items-center justify-center leading-none">
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          )}
        </button>

        {/* Theme toggle — mobile */}
        <button onClick={toggle} className="md:hidden p-2 text-dp-muted hover:text-dp-cream transition-colors" aria-label="Toggle theme">
          {dark ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(o => !o)} className="md:hidden flex flex-col gap-1.5 p-2" aria-label="Toggle menu">
          <span className={`block w-6 h-0.5 bg-dp-cream transition-transform duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-dp-cream transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-dp-cream transition-transform duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-dp-bg/98 backdrop-blur-md border-t border-dp-border overflow-hidden"
          >
            <nav className="px-6 py-4 flex flex-col gap-1">
              {mobileLinks.map(link => (
                <NavLink key={link.to} to={link.to} end={link.to === '/'}
                  className={({ isActive }) => `font-body text-sm py-3 border-b border-dp-border/50 transition-colors ${isActive ? 'text-dp-gold' : 'text-dp-muted'}`}>
                  {link.label}
                </NavLink>
              ))}
              {user ? (
                <>
                  <NavLink to="/profile" className={({ isActive }) => `font-body text-sm py-3 border-b border-dp-border/50 transition-colors ${isActive ? 'text-dp-gold' : 'text-dp-muted'}`}>
                    My Profile
                  </NavLink>
                  <button onClick={signOut} className="font-body text-sm py-3 text-left text-red-400">Sign Out</button>
                </>
              ) : (
                <NavLink to="/auth" className={({ isActive }) => `font-body text-sm py-3 border-b border-dp-border/50 transition-colors ${isActive ? 'text-dp-gold' : 'text-dp-muted'}`}>
                  Sign In / Create Account
                </NavLink>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
