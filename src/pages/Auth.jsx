import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'

const ADMIN_EMAILS = ['musaanthony123456@gmail.com']

// ── Floating gold particles background ────────────────────────────────────────
function FloatingParticles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    class Particle {
      constructor() { this.reset() }
      reset() {
        this.x       = Math.random() * canvas.width
        this.y       = Math.random() * canvas.height
        this.size    = Math.random() * 1.8 + 0.4
        this.speedX  = (Math.random() - 0.5) * 0.35
        this.speedY  = (Math.random() - 0.5) * 0.35
        this.opacity = Math.random() * 0.25 + 0.05
      }
      update() {
        this.x += this.speedX
        this.y += this.speedY
        if (this.x > canvas.width)  this.x = 0
        if (this.x < 0)             this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0)             this.y = canvas.height
      }
      draw() {
        ctx.fillStyle = `rgba(154, 117, 32, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const particles = Array.from({ length: 55 }, () => new Particle())
    let raf
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => { p.update(); p.draw() })
      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}

// ── Animated input with floating label + gold mouse-glow ─────────────────────
function FloatField({ type, placeholder, value, onChange, icon, showToggle, onToggle, showPass }) {
  const [focused, setFocused]   = useState(false)
  const [hover, setHover]       = useState(false)
  const [mouse, setMouse]       = useState({ x: 0, y: 0 })
  const lifted = focused || value.length > 0

  const onMove = e => {
    const r = e.currentTarget.getBoundingClientRect()
    setMouse({ x: e.clientX - r.left, y: e.clientY - r.top })
  }

  return (
    <div
      className={`relative rounded-xl border transition-all duration-200 overflow-hidden
        ${focused ? 'border-dp-gold shadow-[0_0_0_3px_rgba(154,117,32,0.15)]' : 'border-dp-border'}
        bg-dp-bg`}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* mouse-glow */}
      {hover && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{ background: `radial-gradient(180px circle at ${mouse.x}px ${mouse.y}px, rgba(154,117,32,0.08) 0%, transparent 70%)` }}
        />
      )}

      {/* icon */}
      <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused ? 'text-dp-gold' : 'text-dp-muted'}`}>
        {icon}
      </div>

      {/* floating label */}
      <label className={`absolute left-10 pointer-events-none transition-all duration-200 font-body
        ${lifted ? 'top-2 text-[10px] tracking-widest uppercase text-dp-gold' : 'top-1/2 -translate-y-1/2 text-sm text-dp-muted'}`}>
        {placeholder}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete={type === 'password' ? (showToggle ? 'current-password' : 'new-password') : type === 'email' ? 'email' : 'name'}
        className={`w-full bg-transparent pl-10 pr-11 font-body text-sm text-dp-cream focus:outline-none
          ${lifted ? 'pt-5 pb-2' : 'py-3.5'}`}
      />

      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dp-muted hover:text-dp-gold transition-colors"
        >
          {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      )}
    </div>
  )
}

// ── Main Auth page ─────────────────────────────────────────────────────────────
export default function Auth() {
  const [mode, setMode]         = useState('signin')
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const [busy, setBusy]         = useState(false)

  const [resetSent, setResetSent] = useState(false)

  const { user, isAdmin, signUpEmail, signInEmail, signInGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from     = location.state?.from || '/'

  // Navigate only after auth context has updated — avoids race with AdminRoute.
  useEffect(() => {
    if (!user) return
    const isOwner = ADMIN_EMAILS.includes(user.email?.toLowerCase())
    if (isAdmin || isOwner) {
      navigate('/admin', { replace: true })
    } else {
      navigate(from, { replace: true })
    }
  }, [user, isAdmin])

  const switchMode = m => {
    setMode(m); setError('')
    setName(''); setEmail(''); setPassword(''); setShowPass(false)
  }

  const handleGoogle = async () => {
    setBusy(true); setError('')
    try {
      await signInGoogle()
    }
    catch (e) { setError(friendlyError(e.code || e.message)) }
    finally { setBusy(false) }
  }

  const handleSubmit = async e => {
    e.preventDefault(); setError('')
    if (!email.includes('@') || !email.includes('.')) return setError('Enter a valid email address.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    if (mode === 'signup' && !name.trim()) return setError('Please enter your full name.')
    setBusy(true)
    try {
      let u
      if (mode === 'signup') await signUpEmail(email, password, name)
      else await signInEmail(email, password)
    } catch (e) {
      setError(friendlyError(e.code || e.message))
    } finally {
      setBusy(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email.includes('@')) return setError('Enter your email above first, then click Forgot password.')
    setBusy(true); setError('')
    try {
      await sendPasswordResetEmail(auth, email)
      setResetSent(true)
    } catch (e) {
      setError(friendlyError(e.code || e.message))
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-screen bg-dp-bg flex items-center justify-center p-4 pt-20 pb-24 relative overflow-hidden">
      <FloatingParticles />

      {/* subtle radial glow behind card */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(600px circle at 50% 45%, rgba(154,117,32,0.06) 0%, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-dp-card backdrop-blur-2xl border border-dp-border rounded-2xl p-8 shadow-xl shadow-black/40"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-dp-gold/10 border border-dp-gold/25 mb-4">
              <User className="w-7 h-7 text-dp-gold" />
            </div>
            <h1 className="font-display text-3xl text-dp-cream mb-1">
              {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="font-body text-sm text-dp-muted">
              {mode === 'signup' ? 'Join Daniel Perfumes — it\'s free' : 'Sign in to order and take the quiz'}
            </p>
          </div>

          {/* Mode tabs */}
          <div className="flex p-1 bg-dp-bg rounded-xl mb-7 border border-dp-border">
            {['signin', 'signup'].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`flex-1 py-2 rounded-lg font-body text-sm font-medium transition-all duration-200 ${
                  mode === m
                    ? 'bg-dp-gold text-white shadow-sm'
                    : 'text-dp-muted hover:text-dp-cream'
                }`}
              >
                {m === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 mb-5 rounded-xl border border-dp-border bg-dp-bg hover:border-dp-gold/40 hover:bg-dp-bg/80 transition-all duration-200 font-body text-sm text-dp-cream disabled:opacity-50 active:scale-[0.98] group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-dp-gold/10 via-transparent to-dp-gold/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <GoogleIcon />
            <span className="relative">Continue with Google</span>
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-dp-border" />
            <span className="font-body text-[10px] text-dp-muted uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-dp-border" />
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.22 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {mode === 'signup' && (
                <FloatField
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  icon={<User size={17} />}
                />
              )}

              <FloatField
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                icon={<Mail size={17} />}
              />

              <FloatField
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                icon={<Lock size={17} />}
                showToggle
                onToggle={() => setShowPass(v => !v)}
                showPass={showPass}
              />

              {mode === 'signin' && (
                <div className="flex justify-end -mt-1">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={busy}
                    className="font-body text-xs text-dp-muted hover:text-dp-gold transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {resetSent && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-900/20 border border-green-500/30 rounded-xl px-4 py-3"
                >
                  <p className="font-body text-xs text-green-400 leading-relaxed">
                    Password reset email sent — check your inbox, then sign in with your new password.
                  </p>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-900/20 border border-red-500/30 rounded-xl px-4 py-3"
                >
                  <p className="font-body text-xs text-red-400 leading-relaxed">{error}</p>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="relative w-full overflow-hidden rounded-xl py-3.5 font-body text-sm font-semibold tracking-widest uppercase
                  bg-dp-gold text-white transition-all duration-300
                  hover:bg-dp-gold-light disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] group"
              >
                <span className={`transition-opacity duration-150 ${busy ? 'opacity-0' : 'opacity-100'}`}>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                </span>
                {busy && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </span>
                )}
                {/* shimmer */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              </button>
            </motion.form>
          </AnimatePresence>

          {/* Footer link */}
          <p className="font-body text-xs text-dp-muted text-center mt-7">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-dp-gold hover:text-dp-gold-light font-semibold transition-colors"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </motion.div>

        <p className="font-body text-[10px] text-dp-muted/50 text-center mt-5 px-4">
          By continuing you agree to Daniel Perfumes' terms of service.
        </p>
      </div>
    </main>
  )
}

function friendlyError(code) {
  const map = {
    'auth/email-already-in-use':   'An account with this email already exists. Try signing in.',
    'auth/user-not-found':         'No account found with this email. Please create an account.',
    'auth/wrong-password':         'Incorrect password. Please try again.',
    'auth/invalid-email':          'Please enter a valid email address.',
    'auth/weak-password':          'Password must be at least 6 characters.',
    'auth/too-many-requests':      'Too many attempts — wait a few minutes and try again.',
    'auth/popup-closed-by-user':   'Google sign-in was cancelled.',
    'auth/popup-blocked':          'Pop-up blocked. Allow pop-ups for this site and try again.',
    'auth/network-request-failed': 'Network error. Check your internet connection.',
    'auth/invalid-credential':     'Email or password is incorrect.',
    'auth/operation-not-allowed':  'Email sign-in is not enabled yet. Please use Google or contact support.',
    'auth/user-disabled':          'This account has been disabled.',
    'No account found with this email.': 'No account found with this email. Please create an account.',
  }
  if (map[code]) return map[code]
  if (typeof code === 'string') {
    const clean = code.replace(/^Firebase:\s*/i, '').replace(/\s*\(auth\/.*\)\.$/, '')
    if (clean.length < 120) return clean
  }
  return 'Something went wrong. Please try again.'
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}
