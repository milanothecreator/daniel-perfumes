import { createContext, useContext, useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { auth, db, firebaseReady } from '../lib/firebase'

const AuthContext = createContext(null)

function loadLocal() {
  try { return JSON.parse(localStorage.getItem('dp_user')) } catch { return null }
}
function saveLocal(u) {
  if (u) localStorage.setItem('dp_user', JSON.stringify(u))
  else localStorage.removeItem('dp_user')
}
function toUser(fb) {
  const provider = fb.providerData?.[0]?.providerId?.replace('.com', '') || 'email'
  const name = fb.displayName || fb.email.split('@')[0]
  return {
    id: fb.uid,
    name,
    email: fb.email,
    provider,
    initials: name.slice(0, 2).toUpperCase(),
    createdAt: fb.metadata?.creationTime || new Date().toISOString(),
  }
}

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(firebaseReady ? null : loadLocal)
  const [role, setRole]     = useState('customer')
  const [loading, setLoading] = useState(firebaseReady)

  useEffect(() => {
    if (!firebaseReady) return
    let unsubProfile = null

    const unsubAuth = onAuthStateChanged(auth, fb => {
      if (unsubProfile) { unsubProfile(); unsubProfile = null }

      if (!fb) {
        setUser(null); setRole('customer'); setLoading(false)
        return
      }

      const u = toUser(fb)
      const ref = doc(db, 'users', fb.uid)

      // Live listener — role changes made by admin propagate instantly.
      unsubProfile = onSnapshot(ref,
        async snap => {
          if (snap.exists()) {
            const data = snap.data()
            if (data.disabled) {
              await fbSignOut(auth); return
            }
            setRole(data.role || 'customer')
          } else {
            // First sign-in — create the profile doc.
            try {
              await setDoc(ref, {
                name: u.name, email: u.email, provider: u.provider,
                role: 'customer', disabled: false, createdAt: serverTimestamp(),
              })
            } catch {}
            setRole('customer')
          }
          setUser(u); setLoading(false)
        },
        () => {
          // Firestore rules blocking read — let them in as customer.
          setUser(u); setRole('customer'); setLoading(false)
        }
      )
    })

    return () => { unsubAuth(); if (unsubProfile) unsubProfile() }
  }, [])

  // ── Sign up: create account → immediately signed in, no verification step ──
  const signUpEmail = async (email, password, name) => {
    if (!firebaseReady) {
      const u = { id: btoa(email), name, email, provider: 'email', initials: name.slice(0, 2).toUpperCase(), createdAt: new Date().toISOString() }
      setUser(u); saveLocal(u); return u
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (name) await updateProfile(cred.user, { displayName: name })
    await setDoc(doc(db, 'users', cred.user.uid), {
      name: name || cred.user.email.split('@')[0],
      email: cred.user.email, provider: 'email',
      role: 'customer', disabled: false, createdAt: serverTimestamp(),
    }, { merge: true })
    // onAuthStateChanged fires automatically — user is now signed in
    return toUser(cred.user)
  }

  // ── Sign in: email + password, no email-verified gate ──
  const signInEmail = async (email, password) => {
    if (!firebaseReady) {
      const stored = loadLocal()
      if (stored?.email === email) { setUser(stored); return stored }
      throw new Error('No account found with this email.')
    }
    const cred = await signInWithEmailAndPassword(auth, email, password)
    return toUser(cred.user)
  }

  // ── Sign in with Google (always shows account picker) ──
  const signInGoogle = async () => {
    if (!firebaseReady) throw new Error('Google sign-in requires Firebase setup.')
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    const cred = await signInWithPopup(auth, provider)
    return toUser(cred.user)
  }

  const signOut = () => {
    if (firebaseReady) return fbSignOut(auth)
    setUser(null); saveLocal(null)
  }

  return (
    <AuthContext.Provider value={{ user, role, isAdmin: role === 'admin', loading, signUpEmail, signInEmail, signInGoogle, signOut, firebaseReady }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
