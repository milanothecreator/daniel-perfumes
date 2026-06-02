import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  ChevronRight, ShoppingBag, Sparkles, Star, Heart, LogOut,
  Mail, MapPin, Moon, Sun, User, Shield, RefreshCw,
  Eye, ChevronDown, Check, X, Edit3, ShoppingCart,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useLikes } from '../context/LikesContext'
import { usePrivacy } from '../context/PrivacyContext'
import { useProducts } from '../context/ProductsContext'
import { categories } from '../data/products'
import { generalWhatsApp } from '../lib/whatsapp'

const ADMIN_EMAILS = ['musaanthony123456@gmail.com']

const providerLabel = { google: 'Google', apple: 'Apple', facebook: 'Facebook', email: 'Email', password: 'Email' }

function SavedCard({ product }) {
  const cat = categories.find(c => c.slug === product.category)
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd(e) {
    e.preventDefault()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 900)
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="bg-dp-card border border-dp-border rounded-2xl overflow-hidden block transition-transform active:scale-[0.98]"
    >
      <div
        className="relative h-28 flex items-center justify-center"
        style={{ background: `linear-gradient(145deg, ${product.placeholderColor}44, ${product.placeholderColor}18)` }}
      >
        {(product.images?.[0] || product.image)
          ? <img src={product.images?.[0] || product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
          : <span className="font-display font-bold text-4xl select-none" style={{ color: `${product.placeholderColor}60` }}>{product.placeholderInitial}</span>}
        <span
          className="absolute top-2 left-2 font-body text-[8px] tracking-widest uppercase px-1.5 py-0.5 rounded-full"
          style={{ background: `${cat?.accent}18`, color: cat?.accent, border: `1px solid ${cat?.accent}35` }}
        >
          {cat?.name}
        </span>
      </div>
      <div className="p-2.5 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="font-display text-dp-cream text-xs leading-snug truncate">{product.name}</p>
          <p className="font-body text-[10px] text-dp-gold mt-0.5">{(product.price / 1000).toFixed(0)}k UGX</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm transition-all active:scale-90 ${added ? 'bg-green-500' : 'bg-dp-gold hover:bg-dp-gold-light'}`}
        >
          {added ? <Check size={12} /> : <ShoppingCart size={12} />}
        </button>
      </div>
    </Link>
  )
}

function PrivacyPanel({ onClose }) {
  const { prefs, toggle } = usePrivacy()

  const items = [
    {
      key: 'scentRecommendations',
      icon: Sparkles,
      label: 'Personalised Recommendations',
      desc: 'Use your quiz answers to suggest fragrances you\'ll love.',
    },
    {
      key: 'showSavedItems',
      icon: Heart,
      label: 'Show Saved Items',
      desc: 'Display your saved fragrances on your profile.',
    },
    {
      key: 'showLocation',
      icon: MapPin,
      label: 'Show Location',
      desc: 'Display your city on your profile.',
    },
    {
      key: 'showOnlineStatus',
      icon: Eye,
      label: 'Online Status',
      desc: 'Show the green dot when you\'re active.',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      className="mt-2 bg-dp-card border border-dp-border rounded-2xl divide-y divide-dp-border overflow-hidden"
    >
      {items.map(({ key, icon: Icon, label, desc }) => (
        <div key={key} className="px-4 py-3.5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-dp-gold/10 border border-dp-gold/20 flex items-center justify-center shrink-0 mt-0.5">
            <Icon size={14} className="text-dp-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-body text-sm text-dp-cream leading-snug">{label}</p>
            <p className="font-body text-[11px] text-dp-muted mt-0.5 leading-relaxed">{desc}</p>
          </div>
          <button
            onClick={() => toggle(key)}
            className={`shrink-0 mt-1 w-11 h-6 rounded-full transition-colors duration-200 relative ${prefs[key] ? 'bg-dp-gold' : 'bg-dp-border'}`}
          >
            <span
              className={`block w-4 h-4 rounded-full bg-white shadow absolute top-1 transition-transform duration-200 ${prefs[key] ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>
      ))}

      {/* Data notice */}
      <div className="px-4 py-3 bg-dp-bg/40">
        <p className="font-body text-[10px] text-dp-muted leading-relaxed">
          Daniel Perfumes never sells your personal data. Your information is used only to process orders and improve your experience. View our full privacy terms by contacting us on WhatsApp.
        </p>
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="w-full flex items-center justify-center gap-1.5 py-3 font-body text-xs text-dp-muted hover:text-dp-cream transition-colors"
      >
        <X size={12} /> Close privacy settings
      </button>
    </motion.div>
  )
}

function LocationRow({ user }) {
  const stored = () => { try { return localStorage.getItem('dp_profile_location') || '' } catch { return '' } }
  const [location, setLocation] = useState(stored)
  const [editing, setEditing]   = useState(false)
  const [draft, setDraft]       = useState('')

  function startEdit() { setDraft(location); setEditing(true) }
  function save() {
    const val = draft.trim()
    setLocation(val)
    localStorage.setItem('dp_profile_location', val)
    setEditing(false)
  }
  function cancel() { setEditing(false) }

  if (editing) {
    return (
      <div className="px-4 py-3.5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-dp-gold/10 border border-dp-gold/20 flex items-center justify-center shrink-0">
          <MapPin size={14} className="text-dp-gold" />
        </div>
        <input
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel() }}
          placeholder="e.g. Kampala, Kololo"
          className="flex-1 bg-transparent font-body text-sm text-dp-cream placeholder-dp-muted/60 outline-none border-b border-dp-gold/50 pb-0.5"
        />
        <button onClick={save} className="w-7 h-7 rounded-full bg-dp-gold/20 text-dp-gold flex items-center justify-center hover:bg-dp-gold/30 transition-colors">
          <Check size={13} />
        </button>
        <button onClick={cancel} className="w-7 h-7 rounded-full bg-dp-border text-dp-muted flex items-center justify-center hover:text-dp-cream transition-colors">
          <X size={13} />
        </button>
      </div>
    )
  }

  return (
    <button onClick={startEdit} className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-dp-border/10 transition-colors">
      <div className="w-8 h-8 rounded-xl bg-dp-gold/10 border border-dp-gold/20 flex items-center justify-center shrink-0">
        <MapPin size={14} className="text-dp-gold" />
      </div>
      <span className="flex-1 font-body text-sm text-dp-cream">Location</span>
      <span className="font-body text-xs text-dp-muted truncate max-w-[130px]">
        {location || 'Tap to set'}
      </span>
      <Edit3 size={12} className="text-dp-muted shrink-0 ml-1" />
    </button>
  )
}

export default function Profile() {
  const { user, isAdmin, signOut } = useAuth()
  const { dark, toggle }           = useTheme()
  const { prefs }                  = usePrivacy()
  const navigate                   = useNavigate()
  const [privacyOpen, setPrivacyOpen]   = useState(false)
  const [showAllSaved, setShowAllSaved] = useState(false)
  const { likedIds }                    = useLikes()
  const { products }                    = useProducts()
  const savedProducts                   = products.filter(p => likedIds.has(p.id))
  const visibleSaved                    = showAllSaved ? savedProducts : savedProducts.slice(0, 4)

  const showAdminButton = isAdmin || (user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase()))

  if (!user) { navigate('/auth'); return null }

  function handleSwitchAccount() {
    signOut()
    navigate('/auth')
  }

  return (
    <main className="min-h-screen pb-28">
      <div className="pt-20 max-w-lg mx-auto px-4">

        {/* ── Avatar + name row ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mt-4 mb-5"
        >
          <div className="relative shrink-0">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-dp-gold/60"
              style={{ background: 'linear-gradient(135deg, rgb(var(--dp-gold)/0.25) 0%, rgb(var(--dp-gold)/0.06) 100%)' }}
            >
              <span className="font-display text-xl text-dp-gold">{user.initials}</span>
            </div>
            {prefs.showOnlineStatus && (
              <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-dp-bg" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-display text-lg text-dp-cream leading-tight truncate">{user.name}</h1>
            <p className="font-body text-xs text-dp-muted mt-0.5 truncate">{user.email}</p>
            <span className="inline-block mt-1.5 font-body text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full border border-dp-gold/30 text-dp-gold/80">
              {providerLabel[user.provider]}
            </span>
          </div>

          <a
            href={generalWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 font-body text-xs font-semibold tracking-wide px-3 py-1.5 rounded-full border border-dp-gold/60 text-dp-gold hover:bg-dp-gold/10 transition-colors"
          >
            + Order
          </a>
        </motion.div>

        {/* ── Stats row ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="flex items-center gap-0 mb-5 bg-dp-card border border-dp-border rounded-2xl overflow-hidden"
        >
          {[
            { n: '0',   label: 'Orders' },
            { n: likedIds.size.toString(), label: 'Saved' },
            { n: new Date(user.createdAt).getFullYear().toString(), label: 'Since' },
          ].map((s, i, arr) => (
            <div key={s.label} className={`flex-1 text-center py-3.5 ${i < arr.length - 1 ? 'border-r border-dp-border' : ''}`}>
              <p className="font-display text-lg text-dp-cream leading-none">{s.n}</p>
              <p className="font-body text-[9px] text-dp-muted uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* ── Stat cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="flex gap-3 overflow-x-auto pb-1 mb-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {[
            { icon: ShoppingBag, value: '0',    label: 'Orders',  sub: 'Total' },
            { icon: Heart,       value: likedIds.size.toString(), label: 'Saved', sub: 'Items' },
            { icon: Sparkles,    value: '1',    label: 'Quiz',    sub: 'Taken', badge: 'Done' },
            { icon: Star,        value: 'Gold', label: 'Loyalty', sub: 'Status' },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.14 + i * 0.06 }}
              className="relative shrink-0 w-28 bg-dp-card border border-dp-border rounded-2xl p-4"
            >
              {card.badge && (
                <span className="absolute top-2.5 right-2.5 font-body text-[8px] font-semibold tracking-widest uppercase px-1.5 py-0.5 rounded-full bg-dp-gold/20 text-dp-gold border border-dp-gold/30">
                  {card.badge}
                </span>
              )}
              <div className="w-8 h-8 rounded-xl bg-dp-gold/10 border border-dp-gold/20 flex items-center justify-center mb-3">
                <card.icon size={14} className="text-dp-gold" />
              </div>
              <p className="font-display text-xl text-dp-cream leading-none">{card.value}</p>
              <p className="font-body text-xs text-dp-cream mt-1">{card.label}</p>
              <p className="font-body text-[9px] text-dp-muted uppercase tracking-widest mt-0.5">{card.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Saved Items ── */}
        {prefs.showSavedItems && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="font-body text-[10px] text-dp-muted uppercase tracking-widest">Saved Items</p>
            {savedProducts.length > 0 && (
              <Link to="/shop" className="font-body text-xs text-dp-gold">Browse more</Link>
            )}
          </div>
          {savedProducts.length === 0 ? (
            <div className="bg-dp-card border border-dp-border rounded-2xl p-6 text-center">
              <Heart size={28} className="text-dp-border mx-auto mb-3" />
              <p className="font-body text-sm text-dp-muted mb-3">No saved items yet</p>
              <Link to="/shop" className="font-body text-xs text-dp-gold hover:text-dp-gold-light transition-colors">
                Browse fragrances →
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                {visibleSaved.map(product => (
                  <SavedCard key={product.id} product={product} />
                ))}
              </div>
              {!showAllSaved && savedProducts.length > 4 && (
                <button
                  onClick={() => setShowAllSaved(true)}
                  className="w-full mt-3 py-2.5 rounded-2xl font-body text-sm border border-dp-border text-dp-gold"
                >
                  See more ({savedProducts.length - 4} more)
                </button>
              )}
            </>
          )}
        </motion.section>
        )}

        {/* ── Loyalty banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-5 mb-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(175deg, #040F1F 0%, #0A2A4A 55%, #0E5280 100%)' }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
            style={{ background: '#38BDF8', transform: 'translate(30%, -30%)' }} />
          <div className="absolute top-0 left-0 right-0 h-px opacity-30"
            style={{ background: 'linear-gradient(90deg, transparent, #38BDF8, transparent)' }} />
          <div className="flex items-start justify-between relative">
            <div>
              <p className="font-body text-[9px] tracking-[0.3em] uppercase mb-1.5" style={{ color: '#38BDF8cc' }}>
                Daniel Perfumes
              </p>
              <p className="font-display text-base text-white leading-snug">Rewards Program</p>
              <p className="font-body text-xs mt-1.5 max-w-[200px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Earn points on every order. Redeem for free fragrances.
              </p>
            </div>
            <span
              className="shrink-0 mt-0.5 font-body text-[9px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border"
              style={{ color: '#38BDF8', borderColor: '#38BDF840', background: '#38BDF815' }}
            >
              Coming Soon
            </span>
          </div>
        </motion.div>

        {/* ── Admin section (only for admins) ── */}
        {showAdminButton && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.33 }}
            className="mb-5"
          >
            <p className="font-body text-[10px] text-dp-muted uppercase tracking-widest mb-2 px-1">Administration</p>
            <Link
              to="/admin"
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #1A1210 0%, #0E0F13 100%)', borderColor: 'rgba(241,90,36,0.35)' }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(241,90,36,0.15)', border: '1px solid rgba(241,90,36,0.3)' }}
              >
                <Shield size={14} style={{ color: '#F15A24' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-medium" style={{ color: '#F4F4F6' }}>Admin Panel</p>
                <p className="font-body text-[11px]" style={{ color: '#8A8B93' }}>Manage products, orders & users</p>
              </div>
              <ChevronRight size={13} style={{ color: '#F15A24' }} className="shrink-0" />
            </Link>
          </motion.section>
        )}

        {/* ── Account section ── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36 }}
          className="mb-5"
        >
          <p className="font-body text-[10px] text-dp-muted uppercase tracking-widest mb-2 px-1">Account</p>
          <div className="bg-dp-card border border-dp-border rounded-2xl divide-y divide-dp-border">

            {/* Email */}
            <div className="w-full flex items-center gap-3 px-4 py-3.5">
              <div className="w-8 h-8 rounded-xl bg-dp-gold/10 border border-dp-gold/20 flex items-center justify-center shrink-0">
                <Mail size={14} className="text-dp-gold" />
              </div>
              <span className="flex-1 font-body text-sm text-dp-cream">Email</span>
              <span className="font-body text-xs text-dp-muted truncate max-w-[160px]">{user.email}</span>
            </div>

            {/* Location — editable, hidden when showLocation is off */}
            {prefs.showLocation && <LocationRow user={user} />}

            {/* Sign-in method */}
            <div className="w-full flex items-center gap-3 px-4 py-3.5">
              <div className="w-8 h-8 rounded-xl bg-dp-gold/10 border border-dp-gold/20 flex items-center justify-center shrink-0">
                <User size={14} className="text-dp-gold" />
              </div>
              <span className="flex-1 font-body text-sm text-dp-cream">Sign-in</span>
              <span className="font-body text-xs text-dp-muted">via {providerLabel[user.provider]}</span>
            </div>

            {/* Switch account */}
            <button
              onClick={handleSwitchAccount}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-dp-border/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-dp-gold/10 border border-dp-gold/20 flex items-center justify-center shrink-0">
                <RefreshCw size={14} className="text-dp-gold" />
              </div>
              <span className="flex-1 font-body text-sm text-dp-cream">Switch Account</span>
              <span className="font-body text-xs text-dp-muted">Sign in as another</span>
              <ChevronRight size={13} className="text-dp-muted shrink-0 ml-1" />
            </button>
          </div>
        </motion.section>

        {/* ── Preferences section ── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          className="mb-5"
        >
          <p className="font-body text-[10px] text-dp-muted uppercase tracking-widest mb-2 px-1">Preferences</p>
          <div className="bg-dp-card border border-dp-border rounded-2xl divide-y divide-dp-border">

            {/* Theme */}
            <button onClick={toggle} className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-dp-border/10 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-dp-gold/10 border border-dp-gold/20 flex items-center justify-center shrink-0">
                {dark ? <Sun size={14} className="text-dp-gold" /> : <Moon size={14} className="text-dp-gold" />}
              </div>
              <span className="flex-1 font-body text-sm text-dp-cream">Theme</span>
              <span className="font-body text-xs text-dp-muted">{dark ? 'Dark mode' : 'Light mode'}</span>
              <ChevronRight size={13} className="text-dp-muted shrink-0 ml-1" />
            </button>
          </div>
        </motion.section>

        {/* ── Privacy section ── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48 }}
          className="mb-5"
        >
          <p className="font-body text-[10px] text-dp-muted uppercase tracking-widest mb-2 px-1">Privacy</p>

          <div className="bg-dp-card border border-dp-border rounded-2xl">
            <button
              onClick={() => setPrivacyOpen(o => !o)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-dp-border/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-dp-gold/10 border border-dp-gold/20 flex items-center justify-center shrink-0">
                <Shield size={14} className="text-dp-gold" />
              </div>
              <span className="flex-1 font-body text-sm text-dp-cream">Privacy Settings</span>
              <span className="font-body text-xs text-dp-muted">Manage</span>
              <motion.div
                animate={{ rotate: privacyOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0 ml-1"
              >
                <ChevronDown size={13} className="text-dp-muted" />
              </motion.div>
            </button>
          </div>

          <AnimatePresence>
            {privacyOpen && <PrivacyPanel onClose={() => setPrivacyOpen(false)} />}
          </AnimatePresence>
        </motion.section>

        {/* ── Sign out ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.54 }}
          className="pb-2"
        >
          <button
            onClick={signOut}
            className="w-full flex items-center justify-center gap-2 font-body text-sm text-dp-muted hover:text-red-400 transition-colors px-6 py-3.5 rounded-2xl border border-dp-border hover:border-red-400/30 bg-dp-card"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </motion.div>

      </div>
    </main>
  )
}
