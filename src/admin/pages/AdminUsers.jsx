import { useEffect, useState, useMemo } from 'react'
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { Search, Shield, ShieldOff, Ban, RotateCcw, Check, X } from 'lucide-react'
import { db, firebaseReady } from '../../lib/firebase'
import { useAuth } from '../../context/AuthContext'
import { ADMIN_COLORS as C } from '../AdminLayout'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null) // uid being renamed
  const [nameDraft, setNameDraft] = useState('')
  const { user: me } = useAuth()

  useEffect(() => {
    if (!firebaseReady || !db) return
    return onSnapshot(collection(db, 'users'), s =>
      setUsers(s.docs.map(d => ({ uid: d.id, ...d.data() })))
    )
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return users
      .filter(u => !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q))
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  }, [users, search])

  const update = (uid, data) => updateDoc(doc(db, 'users', uid), data)

  function isOnline(u) {
    if (u.onlineVisible === false) return false
    if (!u.lastSeen?.toDate) return false
    return (Date.now() - u.lastSeen.toDate().getTime()) < 5 * 60 * 1000
  }

  function saveName(uid) {
    if (nameDraft.trim()) update(uid, { name: nameDraft.trim() })
    setEditing(null)
  }

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-semibold mb-1" style={{ color: C.text }}>Users</h1>
      <p className="text-sm mb-5" style={{ color: C.muted }}>{users.length} registered</p>

      <div className="relative mb-4 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.muted }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name or email…"
          className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none"
          style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text }}
        />
      </div>

      <p className="text-xs mb-3" style={{ color: C.muted }}>
        Note: “Remove” disables app access. The login itself is fully deleted from the Firebase console.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filtered.map(u => {
          const isMe = me?.id === u.uid
          const isAdmin = u.role === 'admin'
          return (
            <div
              key={u.uid}
              className="rounded-2xl p-4 flex items-center gap-3 flex-wrap lg:flex-nowrap"
              style={{ background: C.card, border: `1px solid ${C.border}`, opacity: u.disabled ? 0.55 : 1 }}
            >
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                  style={{ background: `${C.orange}22`, color: C.orangeLight }}>
                  {(u.name || u.email || '?').slice(0, 1).toUpperCase()}
                </div>
                {isOnline(u) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2"
                    style={{ borderColor: C.card }} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                {editing === u.uid ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      autoFocus
                      value={nameDraft}
                      onChange={e => setNameDraft(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && saveName(u.uid)}
                      className="rounded-lg px-2 py-1 text-sm outline-none flex-1 min-w-0"
                      style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text }}
                    />
                    <button onClick={() => saveName(u.uid)} className="p-1.5 rounded-lg" style={{ background: `${C.orange}22` }}>
                      <Check size={14} style={{ color: C.orangeLight }} />
                    </button>
                    <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <X size={14} style={{ color: C.muted }} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditing(u.uid); setNameDraft(u.name || '') }}
                    className="text-sm font-medium text-left hover:underline"
                    style={{ color: C.text }}
                  >
                    {u.name || '(no name)'}
                  </button>
                )}
                <p className="text-xs truncate" style={{ color: C.muted }}>{u.email}</p>
              </div>

              {isAdmin && (
                <span className="text-[11px] font-medium px-2 py-1 rounded-full shrink-0"
                  style={{ background: `${C.orange}22`, color: C.orangeLight }}>Admin</span>
              )}
              {u.disabled && (
                <span className="text-[11px] font-medium px-2 py-1 rounded-full shrink-0"
                  style={{ background: '#EF444422', color: '#EF4444' }}>Disabled</span>
              )}

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => update(u.uid, { role: isAdmin ? 'customer' : 'admin' })}
                  disabled={isMe}
                  title={isAdmin ? 'Demote to customer' : 'Make admin'}
                  className="p-2 rounded-lg disabled:opacity-30"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  {isAdmin ? <ShieldOff size={15} style={{ color: C.muted }} /> : <Shield size={15} style={{ color: C.muted }} />}
                </button>
                <button
                  onClick={() => update(u.uid, { disabled: !u.disabled })}
                  disabled={isMe}
                  title={u.disabled ? 'Restore access' : 'Remove (disable)'}
                  className="p-2 rounded-lg disabled:opacity-30"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  {u.disabled ? <RotateCcw size={15} style={{ color: '#22C55E' }} /> : <Ban size={15} style={{ color: '#EF4444' }} />}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
