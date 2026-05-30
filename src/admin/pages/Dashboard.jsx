import { useEffect, useState, useMemo } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'
import { DollarSign, ShoppingCart, Clock, Package, Users as UsersIcon } from 'lucide-react'
import { db, firebaseReady } from '../../lib/firebase'
import { ADMIN_COLORS as C } from '../AdminLayout'

function toDate(ts) {
  if (!ts) return null
  if (typeof ts.toDate === 'function') return ts.toDate()
  return new Date(ts)
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-2xl p-4 sm:p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${accent}1f` }}>
        <Icon size={18} style={{ color: accent }} />
      </div>
      <p className="text-2xl font-semibold" style={{ color: C.text }}>{value}</p>
      <p className="text-xs mt-1" style={{ color: C.muted }}>{label}</p>
    </div>
  )
}

export default function Dashboard() {
  const [orders, setOrders] = useState([])
  const [productCount, setProductCount] = useState(0)
  const [userCount, setUserCount] = useState(0)

  useEffect(() => {
    if (!firebaseReady || !db) return
    const u1 = onSnapshot(collection(db, 'orders'),   s => setOrders(s.docs.map(d => ({ id: d.id, ...d.data() }))))
    const u2 = onSnapshot(collection(db, 'products'), s => setProductCount(s.size))
    const u3 = onSnapshot(collection(db, 'users'),    s => setUserCount(s.size))
    return () => { u1(); u2(); u3() }
  }, [])

  const stats = useMemo(() => {
    const valid = orders.filter(o => o.status !== 'cancelled')
    const revenue = valid.reduce((s, o) => s + (o.total || 0), 0)
    const pending = orders.filter(o => o.status === 'pending').length
    return { revenue, total: orders.length, pending }
  }, [orders])

  // Group orders by day for the chart (last 14 days that have data).
  const chartData = useMemo(() => {
    const byDay = {}
    orders.forEach(o => {
      const d = toDate(o.createdAt)
      if (!d) return
      const key = d.toISOString().slice(0, 10)
      if (!byDay[key]) byDay[key] = { date: key, revenue: 0, orders: 0 }
      if (o.status !== 'cancelled') byDay[key].revenue += o.total || 0
      byDay[key].orders += 1
    })
    return Object.values(byDay)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14)
      .map(d => ({ ...d, label: d.date.slice(5) })) // MM-DD
  }, [orders])

  const fmt = n => n.toLocaleString('en-UG')

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-semibold mb-1" style={{ color: C.text }}>Dashboard</h1>
      <p className="text-sm mb-6" style={{ color: C.muted }}>Business overview</p>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        <StatCard icon={DollarSign}  label="Total revenue (UGX)" value={fmt(stats.revenue)} accent={C.orange} />
        <StatCard icon={ShoppingCart} label="Total orders"        value={stats.total}        accent="#3B82F6" />
        <StatCard icon={Clock}        label="Pending orders"      value={stats.pending}      accent="#EAB308" />
        <StatCard icon={Package}      label="Products"            value={productCount}       accent="#22C55E" />
        <StatCard icon={UsersIcon}    label="Users"              value={userCount}          accent="#A855F7" />
      </div>

      <div className="rounded-2xl p-4 sm:p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: C.text }}>Revenue & orders over time</h2>
        {chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-sm" style={{ color: C.muted }}>
            No orders yet. Charts will appear once orders come in.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 5, right: 8, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.orange} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={C.orange} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gOrd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="label" stroke={C.muted} tick={{ fontSize: 11 }} />
              <YAxis stroke={C.muted} tick={{ fontSize: 11 }} width={48} />
              <Tooltip
                contentStyle={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, color: C.text }}
                labelStyle={{ color: C.muted }}
                formatter={(v, name) => name === 'revenue' ? [fmt(v) + ' UGX', 'Revenue'] : [v, 'Orders']}
              />
              <Area type="monotone" dataKey="revenue" stroke={C.orange} fill="url(#gRev)" strokeWidth={2} />
              <Area type="monotone" dataKey="orders" stroke="#3B82F6" fill="url(#gOrd)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
