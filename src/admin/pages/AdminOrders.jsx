import { useEffect, useState } from 'react'
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore'
import { ChevronDown, Package } from 'lucide-react'
import { db, firebaseReady } from '../../lib/firebase'
import { ADMIN_COLORS as C } from '../AdminLayout'

const STATUSES = ['pending', 'confirmed', 'delivered', 'cancelled']
const STATUS_COLOR = {
  pending:   '#EAB308',
  confirmed: '#3B82F6',
  delivered: '#22C55E',
  cancelled: '#EF4444',
}

function toDate(ts) {
  if (!ts) return null
  if (typeof ts.toDate === 'function') return ts.toDate()
  return new Date(ts)
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [open, setOpen] = useState(null)

  useEffect(() => {
    if (!firebaseReady || !db) return
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, s => setOrders(s.docs.map(d => ({ id: d.id, ...d.data() }))))
  }, [])

  async function setStatus(id, status) {
    await updateDoc(doc(db, 'orders', id), { status })
  }

  const fmt = n => (n || 0).toLocaleString('en-UG')

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-semibold mb-1" style={{ color: C.text }}>Orders</h1>
      <p className="text-sm mb-6" style={{ color: C.muted }}>{orders.length} total</p>

      {orders.length === 0 ? (
        <div className="rounded-2xl p-10 text-center text-sm" style={{ background: C.card, border: `1px solid ${C.border}`, color: C.muted }}>
          <Package size={28} className="mx-auto mb-3" style={{ color: C.muted }} />
          No orders yet.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map(o => {
            const d = toDate(o.createdAt)
            const isOpen = open === o.id
            return (
              <div key={o.id} className="rounded-2xl overflow-hidden" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                <button
                  onClick={() => setOpen(isOpen ? null : o.id)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: C.text }}>
                      {o.customer?.name || 'Guest'}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                      {d ? d.toLocaleString('en-UG', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
                      {' · '}{o.items?.length || 0} item{(o.items?.length || 0) !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className="text-sm font-semibold shrink-0" style={{ color: C.orange }}>{fmt(o.total)} UGX</span>
                  <span
                    className="text-[11px] font-medium px-2 py-1 rounded-full shrink-0 capitalize"
                    style={{ background: `${STATUS_COLOR[o.status] || C.muted}22`, color: STATUS_COLOR[o.status] || C.muted }}
                  >
                    {o.status || 'pending'}
                  </span>
                  <ChevronDown size={16} style={{ color: C.muted, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4" style={{ borderTop: `1px solid ${C.border}` }}>
                    <div className="py-3 space-y-1.5">
                      {(o.items || []).map((it, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span style={{ color: C.text }}>{it.name} <span style={{ color: C.muted }}>× {it.qty}</span></span>
                          <span style={{ color: C.muted }}>{fmt(it.price * it.qty)} UGX</span>
                        </div>
                      ))}
                    </div>
                    {o.customer?.email && (
                      <p className="text-xs mb-3" style={{ color: C.muted }}>Contact: {o.customer.email}</p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs" style={{ color: C.muted }}>Status:</span>
                      {STATUSES.map(s => (
                        <button
                          key={s}
                          onClick={() => setStatus(o.id, s)}
                          className="text-[11px] font-medium px-2.5 py-1 rounded-full capitalize transition-opacity"
                          style={{
                            background: o.status === s ? STATUS_COLOR[s] : 'transparent',
                            color: o.status === s ? '#fff' : C.muted,
                            border: `1px solid ${o.status === s ? STATUS_COLOR[s] : C.border}`,
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
