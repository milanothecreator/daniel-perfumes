import { useState } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingCart, Users as UsersIcon,
  LogOut, Menu, X, Store, Sparkles, Megaphone,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// Self-contained admin theme — charcoal + orange. Does not touch the dp-* tokens.
const C = {
  bg: '#0E0F13',
  card: '#17181D',
  border: 'rgba(255,255,255,0.07)',
  text: '#F4F4F6',
  muted: '#8A8B93',
  orange: '#F15A24',
  orangeLight: '#FF6B2C',
}

const NAV = [
  { to: '/admin',           label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products',  label: 'Products',  icon: Package },
  { to: '/admin/orders',    label: 'Orders',    icon: ShoppingCart },
  { to: '/admin/users',     label: 'Users',     icon: UsersIcon },
  { to: '/admin/adverts',   label: 'Adverts',   icon: Megaphone },
]

function NavItems({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors"
          style={({ isActive }) => ({
            color: isActive ? '#fff' : C.muted,
            background: isActive ? C.orange : 'transparent',
          })}
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-1">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(241,90,36,0.14)' }}>
        <Sparkles size={18} style={{ color: C.orangeLight }} />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold" style={{ color: C.text }}>Daniel Perfumes</p>
        <p className="text-[11px]" style={{ color: C.muted }}>Admin Panel</p>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [drawer, setDrawer] = useState(false)
  const { signOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/')
  }

  const SidebarBody = (
    <div className="flex flex-col h-full p-4">
      <div className="mb-7 mt-1"><Brand /></div>
      <NavItems onNavigate={() => setDrawer(false)} />
      <div className="mt-auto flex flex-col gap-1 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
        <Link
          to="/"
          onClick={() => setDrawer(false)}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors"
          style={{ color: C.muted }}
        >
          <Store size={18} /> View store
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left"
          style={{ color: C.muted }}
        >
          <LogOut size={18} /> Log out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: C.bg, color: C.text }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col fixed inset-y-0 left-0 w-60 z-40"
        style={{ background: C.card, borderRight: `1px solid ${C.border}` }}
      >
        {SidebarBody}
      </aside>

      {/* Mobile top bar */}
      <header
        className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14"
        style={{ background: C.card, borderBottom: `1px solid ${C.border}` }}
      >
        <Brand />
        <button
          onClick={() => setDrawer(true)}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.05)' }}
          aria-label="Open menu"
        >
          <Menu size={18} style={{ color: C.text }} />
        </button>
      </header>

      {/* Mobile drawer */}
      {drawer && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 w-64" style={{ background: C.card, borderRight: `1px solid ${C.border}` }}>
            <button
              onClick={() => setDrawer(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.05)' }}
              aria-label="Close menu"
            >
              <X size={16} style={{ color: C.text }} />
            </button>
            {SidebarBody}
          </div>
        </div>
      )}

      {/* Content */}
      <main className="md:ml-60 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}

export { C as ADMIN_COLORS }
