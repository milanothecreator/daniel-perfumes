import { BrowserRouter, Routes, Route, useLocation, NavLink, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import PremiumBg from './components/ui/mesh-bg'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Category from './pages/Category'
import Quiz from './pages/Quiz'
import About from './pages/About'
import Product from './pages/Product'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { CartProvider } from './context/CartContext'
import { ProductsProvider } from './context/ProductsContext'
import CartSheet from './components/CartSheet'
import AdminRoute from './admin/AdminRoute'
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/pages/Dashboard'
import AdminProducts from './admin/pages/AdminProducts'
import AdminOrders from './admin/pages/AdminOrders'
import AdminUsers from './admin/pages/AdminUsers'
import AdminAdverts from './admin/pages/AdminAdverts'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function RequireAuth({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to="/auth" state={{ from: location.pathname }} replace />
  return children
}

function BottomNav() {
  const { user } = useAuth()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-dp-bg/96 backdrop-blur-md border-t border-dp-border">
      <div className="flex items-center justify-around px-2 py-2">
        <NavLink to="/" end className={({ isActive }) => `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${isActive ? 'text-dp-gold' : 'text-dp-muted'}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="font-body text-[10px] tracking-wide">Home</span>
        </NavLink>

        <NavLink to="/shop" className={({ isActive }) => `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${isActive ? 'text-dp-gold' : 'text-dp-muted'}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="font-body text-[10px] tracking-wide">Shop</span>
        </NavLink>

        <NavLink to="/quiz" className={({ isActive }) => `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${isActive ? 'text-dp-gold' : 'text-dp-muted'}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="font-body text-[10px] tracking-wide">Quiz</span>
        </NavLink>

        <NavLink to={user ? '/profile' : '/auth'} className={({ isActive }) => `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${isActive ? 'text-dp-gold' : 'text-dp-muted'}`}>
          {user ? (
            <div className="w-5 h-5 rounded-full bg-dp-gold/30 border border-dp-gold/60 flex items-center justify-center">
              <span className="font-body text-[8px] text-dp-gold font-bold">{user.initials.slice(0, 1)}</span>
            </div>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
          <span className="font-body text-[10px] tracking-wide">{user ? 'Profile' : 'Account'}</span>
        </NavLink>
      </div>
    </nav>
  )
}

function CustomerLayout() {
  return (
    <>
      <PremiumBg />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/category/:slug" element={<Category />} />
        <Route path="/quiz" element={<RequireAuth><Quiz /></RequireAuth>} />
        <Route path="/about" element={<About />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="*" element={<Home />} />
      </Routes>
      <BottomNav />
      <CartSheet />
    </>
  )
}

function AppInner() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="adverts" element={<AdminAdverts />} />
        </Route>
        <Route path="/*" element={<CustomerLayout />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ProductsProvider>
            <CartProvider>
              <AppInner />
            </CartProvider>
          </ProductsProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
