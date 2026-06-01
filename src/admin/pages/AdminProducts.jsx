import { useEffect, useRef, useState } from 'react'
import { collection, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { Plus, Pencil, Trash2, X, Upload, Loader2, Database } from 'lucide-react'
import { db, firebaseReady } from '../../lib/firebase'
import { uploadImage, cloudinaryReady } from '../../lib/cloudinary'
import { products as seedProducts, categories } from '../../data/products'
import { ADMIN_COLORS as C } from '../AdminLayout'

const LONGEVITY = ['All day', 'Intense & lingering', 'Light & fresh']

const EMPTY = {
  id: '', name: '', category: 'woody', price: 0, description: '',
  notes: { top: '', heart: '', base: '' },
  longevity: 'All day', occasion: '', size: '50ml',
  placeholderColor: '#C8A888', placeholderInitial: '', images: [],
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs block mb-1.5" style={{ color: C.muted }}>{label}</span>
      {children}
    </label>
  )
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(null) // null = closed
  const [isNew, setIsNew] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const seededRef = useRef(false)

  useEffect(() => {
    if (!firebaseReady || !db) return
    return onSnapshot(collection(db, 'products'), snap => {
      const firestoreProducts = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setProducts(firestoreProducts)

      // Auto-sync: push static catalog to Firestore if count is behind or any
      // known product is missing its image. Runs once per admin session.
      if (seededRef.current) return
      const firestoreMap = Object.fromEntries(firestoreProducts.map(p => [p.id, p]))
      const needsSync = seedProducts.some(sp => {
        const ex = firestoreMap[sp.id]
        if (!ex) return true                          // new product
        if (ex.image?.includes('cloudinary')) return false // keep custom uploads
        return ex.image !== sp.image                  // image changed in catalog
      })
      if (!needsSync) return
      seededRef.current = true
      Promise.all(
        seedProducts.map(p => {
          const existing = firestoreMap[p.id]
          // Preserve any images the admin already uploaded
          const existingImages = existing?.images?.length
            ? existing.images
            : existing?.image ? [existing.image] : null
          const toWrite = {
            ...p,
            images: existingImages ?? (p.image ? [p.image] : []),
            updatedAt: serverTimestamp(),
          }
          return setDoc(doc(db, 'products', p.id), toWrite, { merge: true })
        })
      )
    })
  }, [])

  const inputStyle = { background: C.bg, border: `1px solid ${C.border}`, color: C.text }
  const inputCls = 'w-full rounded-xl px-3 py-2.5 text-sm outline-none'

  function openEdit(p) {
    const copy = JSON.parse(JSON.stringify(p))
    // Normalize legacy single-image products
    if (!copy.images?.length && copy.image) copy.images = [copy.image]
    if (!copy.images) copy.images = []
    setForm(copy)
    setIsNew(false)
  }
  function openNew() {
    setForm({ ...EMPTY, id: `p-${Date.now()}` })
    setIsNew(true)
  }

  async function seed() {
    setSeeding(true)
    try {
      await Promise.all(seedProducts.map(p =>
        setDoc(doc(db, 'products', p.id), { ...p, image: p.image ?? null, updatedAt: serverTimestamp() }, { merge: true })
      ))
    } finally { setSeeding(false) }
  }

  async function handleUploadSlot(e, i) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setForm(f => {
        const imgs = [...(f.images || [])]
        imgs[i] = url
        return { ...f, images: imgs }
      })
    } catch (err) {
      alert(err.message)
    } finally { setUploading(false) }
  }

  function removeImg(i) {
    setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))
  }

  async function save() {
    if (!form.name.trim()) { alert('Name is required.'); return }
    setSaving(true)
    try {
      const { id, ...data } = form
      const images = form.images || []
      await setDoc(doc(db, 'products', id), {
        ...data,
        images,
        image: images[0] || null,
        price: Number(form.price) || 0,
        updatedAt: serverTimestamp(),
      }, { merge: true })
      setForm(null)
    } finally { setSaving(false) }
  }

  async function remove(id) {
    if (!confirm('Delete this product? This cannot be undone.')) return
    await deleteDoc(doc(db, 'products', id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1 gap-3 flex-wrap">
        <h1 className="text-xl sm:text-2xl font-semibold" style={{ color: C.text }}>Products</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={seed}
            disabled={seeding}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.05)', color: C.muted }}
          >
            {seeding ? <Loader2 size={14} className="animate-spin" /> : <Database size={14} />}
            Seed defaults
          </button>
          <button
            onClick={openNew}
            className="flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-xl"
            style={{ background: C.orange, color: '#fff' }}
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>
      <p className="text-sm mb-5" style={{ color: C.muted }}>{products.length} products</p>

      {products.length === 0 && (
        <div className="rounded-2xl p-8 text-center text-sm mb-5" style={{ background: C.card, border: `1px solid ${C.border}`, color: C.muted }}>
          No products in the database yet. Click <strong style={{ color: C.text }}>Seed defaults</strong> to import the catalog.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {products.map(p => {
          const cat = categories.find(c => c.slug === p.category)
          return (
            <div key={p.id} className="rounded-2xl overflow-hidden flex flex-col" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <div className="h-28 relative overflow-hidden" style={{ background: `${p.placeholderColor}22` }}>
                {(p.images?.[0] || p.image) ? (
                  <img src={p.images?.[0] || p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold" style={{ color: p.placeholderColor }}>{p.placeholderInitial}</span>
                )}
                {p.images?.length > 1 && (
                  <span className="absolute bottom-1.5 right-1.5 font-body text-[9px] px-1.5 py-0.5 rounded-full bg-black/50 text-white">
                    {p.images.length} photos
                  </span>
                )}
              </div>
              <div className="p-3 flex flex-col flex-1">
                <p className="text-sm font-medium" style={{ color: C.text }}>{p.name}</p>
                <p className="text-xs mt-0.5" style={{ color: C.muted }}>{cat?.name} · {(p.price || 0).toLocaleString('en-UG')} UGX</p>
                <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
                  <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', color: C.text }}>
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={() => remove(p.id)} className="p-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.12)' }}>
                    <Trash2 size={14} style={{ color: '#EF4444' }} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Edit / Add modal */}
      {form && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setForm(null)} />
          <div className="relative w-full max-w-md h-full overflow-y-auto p-5" style={{ background: C.card, borderLeft: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold" style={{ color: C.text }}>{isNew ? 'Add product' : 'Edit product'}</h2>
              <button onClick={() => setForm(null)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <X size={16} style={{ color: C.muted }} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Images — up to 4 slots */}
              <div>
                <span className="text-xs block mb-2" style={{ color: C.muted }}>
                  Photos (up to 4) {uploading && <Loader2 size={11} className="inline animate-spin ml-1" />}
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 2, 3].map(i => {
                    const url = form.images?.[i]
                    return (
                      <div key={i} className="relative rounded-xl overflow-hidden"
                        style={{ aspectRatio: '1', background: C.bg, border: `1px solid ${C.border}` }}>
                        {url ? (
                          <>
                            <img src={url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                            <button
                              onClick={() => removeImg(i)}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                              style={{ background: 'rgba(0,0,0,0.65)' }}
                            >
                              <X size={10} style={{ color: '#fff' }} />
                            </button>
                          </>
                        ) : (
                          <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer gap-1"
                            style={{ color: C.muted }}>
                            <Upload size={13} />
                            <span className="text-[9px]">{i === 0 ? 'Main' : `+${i + 1}`}</span>
                            <input type="file" accept="image/*" className="hidden"
                              disabled={uploading || !cloudinaryReady}
                              onChange={e => handleUploadSlot(e, i)} />
                          </label>
                        )}
                      </div>
                    )
                  })}
                </div>
                {!cloudinaryReady && <p className="text-[11px] mt-1.5" style={{ color: '#EAB308' }}>Set Cloudinary env vars to enable uploads.</p>}
              </div>

              <Field label="Name">
                <input className={inputCls} style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Category">
                  <select className={inputCls} style={inputStyle} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select>
                </Field>
                <Field label="Price (UGX)">
                  <input type="number" className={inputCls} style={inputStyle} value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                </Field>
              </div>

              <Field label="Description">
                <textarea rows={3} className={inputCls} style={inputStyle} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </Field>

              <div className="grid grid-cols-3 gap-2">
                <Field label="Top notes">
                  <input className={inputCls} style={inputStyle} value={form.notes.top} onChange={e => setForm(f => ({ ...f, notes: { ...f.notes, top: e.target.value } }))} />
                </Field>
                <Field label="Heart notes">
                  <input className={inputCls} style={inputStyle} value={form.notes.heart} onChange={e => setForm(f => ({ ...f, notes: { ...f.notes, heart: e.target.value } }))} />
                </Field>
                <Field label="Base notes">
                  <input className={inputCls} style={inputStyle} value={form.notes.base} onChange={e => setForm(f => ({ ...f, notes: { ...f.notes, base: e.target.value } }))} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Longevity">
                  <select className={inputCls} style={inputStyle} value={form.longevity} onChange={e => setForm(f => ({ ...f, longevity: e.target.value }))}>
                    {LONGEVITY.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </Field>
                <Field label="Occasion">
                  <input className={inputCls} style={inputStyle} value={form.occasion} onChange={e => setForm(f => ({ ...f, occasion: e.target.value }))} />
                </Field>
              </div>

              <Field label="Size (e.g. 50ml, 100ml)">
                <input className={inputCls} style={inputStyle} value={form.size || ''} placeholder="50ml" onChange={e => setForm(f => ({ ...f, size: e.target.value }))} />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Fallback color">
                  <input type="color" className="w-full h-10 rounded-xl cursor-pointer" style={inputStyle} value={form.placeholderColor} onChange={e => setForm(f => ({ ...f, placeholderColor: e.target.value }))} />
                </Field>
                <Field label="Fallback initials">
                  <input maxLength={2} className={inputCls} style={inputStyle} value={form.placeholderInitial} onChange={e => setForm(f => ({ ...f, placeholderInitial: e.target.value.toUpperCase() }))} />
                </Field>
              </div>
            </div>

            <div className="flex gap-2 mt-6 sticky bottom-0 pb-1">
              <button onClick={() => setForm(null)} className="flex-1 py-3 rounded-xl text-sm font-medium" style={{ background: 'rgba(255,255,255,0.06)', color: C.text }}>Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2" style={{ background: C.orange, color: '#fff' }}>
                {saving && <Loader2 size={15} className="animate-spin" />}
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
