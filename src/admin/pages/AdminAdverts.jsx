import { useEffect, useRef, useState } from 'react'
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore'
import { Upload, Loader2, Trash2, ToggleLeft, ToggleRight, Save } from 'lucide-react'
import { db, firebaseReady } from '../../lib/firebase'
import { uploadVideo, cloudinaryReady } from '../../lib/cloudinary'
import { ADMIN_COLORS as C } from '../AdminLayout'

const DEFAULT = {
  label: 'Exclusive',
  title: 'New Season\nArrivals',
  subtitle: 'Up to 15% off selected fragrances',
  ctaText: 'Shop Now',
  ctaLink: '/category/oriental',
  videoUrl: null,
  active: true,
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs mb-1.5" style={{ color: C.muted }}>{label}</span>
      {children}
    </label>
  )
}

export default function AdminAdverts() {
  const [form, setForm]           = useState(DEFAULT)
  const [saving, setSaving]       = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState(null)
  const [saved, setSaved]         = useState(false)
  const videoRef                  = useRef(null)

  useEffect(() => {
    if (!firebaseReady || !db) return
    return onSnapshot(doc(db, 'adverts', 'banner'), snap => {
      if (snap.exists()) setForm(f => ({ ...DEFAULT, ...snap.data() }))
    })
  }, [])

  const inputStyle = { background: C.bg, border: `1px solid ${C.border}`, color: C.text }
  const inputCls   = 'w-full rounded-xl px-3 py-2.5 text-sm outline-none'

  function set(key, value) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleVideoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!cloudinaryReady) { setError('Cloudinary not configured.'); return }
    setUploading(true)
    setError(null)
    try {
      const url = await uploadVideo(file)
      set('videoUrl', url)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function handleSave() {
    if (!firebaseReady || !db) { setError('Firebase not connected.'); return }
    setSaving(true)
    setError(null)
    try {
      await setDoc(doc(db, 'adverts', 'banner'), { ...form, updatedAt: serverTimestamp() })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: C.text }}>Adverts</h1>
          <p className="text-xs mt-0.5" style={{ color: C.muted }}>Shop page banner — text and video</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-opacity disabled:opacity-50"
          style={{ background: C.orange, color: '#fff' }}
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saved ? 'Saved!' : 'Save'}
        </button>
      </div>

      {error && (
        <p className="mb-4 text-xs px-3 py-2 rounded-xl" style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171' }}>{error}</p>
      )}

      <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>

        {/* Active toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: C.text }}>Banner active</p>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>Toggle to show or hide the banner on the shop page</p>
          </div>
          <button type="button" onClick={() => set('active', !form.active)} className="transition-colors">
            {form.active
              ? <ToggleRight size={32} style={{ color: C.orange }} />
              : <ToggleLeft  size={32} style={{ color: C.muted }}  />
            }
          </button>
        </div>

        <div style={{ height: 1, background: C.border }} />

        {/* Text fields */}
        <Field label="Label (small text above title)">
          <input
            className={inputCls}
            style={inputStyle}
            value={form.label}
            onChange={e => set('label', e.target.value)}
            placeholder="e.g. Exclusive"
          />
        </Field>

        <Field label="Title (use new line for two lines)">
          <textarea
            className={inputCls}
            style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }}
            value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder={"e.g. New Season\nArrivals"}
            rows={2}
          />
        </Field>

        <Field label="Subtitle">
          <input
            className={inputCls}
            style={inputStyle}
            value={form.subtitle}
            onChange={e => set('subtitle', e.target.value)}
            placeholder="e.g. Up to 15% off selected fragrances"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Button text">
            <input
              className={inputCls}
              style={inputStyle}
              value={form.ctaText}
              onChange={e => set('ctaText', e.target.value)}
              placeholder="e.g. Shop Now"
            />
          </Field>
          <Field label="Button link">
            <input
              className={inputCls}
              style={inputStyle}
              value={form.ctaLink}
              onChange={e => set('ctaLink', e.target.value)}
              placeholder="/shop or /category/..."
            />
          </Field>
        </div>

        <div style={{ height: 1, background: C.border }} />

        {/* Video section */}
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: C.text }}>Advert video</p>
          <p className="text-xs mb-3" style={{ color: C.muted }}>
            When a video is set it plays as the banner background. Leave empty to use the gradient design.
          </p>

          {form.videoUrl ? (
            <div className="rounded-xl overflow-hidden relative mb-3" style={{ background: C.bg }}>
              <video
                src={form.videoUrl}
                className="w-full rounded-xl"
                style={{ maxHeight: 180, objectFit: 'cover' }}
                controls
                muted
              />
              <button
                type="button"
                onClick={() => set('videoUrl', null)}
                className="absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.6)' }}
              >
                <Trash2 size={13} style={{ color: '#f87171' }} />
              </button>
            </div>
          ) : (
            <div
              className="rounded-xl border-dashed flex flex-col items-center justify-center gap-2 py-8 mb-3 cursor-pointer"
              style={{ border: `1.5px dashed ${C.border}`, color: C.muted }}
              onClick={() => videoRef.current?.click()}
            >
              {uploading
                ? <Loader2 size={22} className="animate-spin" style={{ color: C.orange }} />
                : <Upload size={22} />
              }
              <span className="text-xs">{uploading ? 'Uploading…' : 'Click to upload a video'}</span>
            </div>
          )}

          <input
            ref={videoRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleVideoUpload}
          />

          {!form.videoUrl && (
            <button
              type="button"
              onClick={() => videoRef.current?.click()}
              disabled={uploading || !cloudinaryReady}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-opacity disabled:opacity-40"
              style={{ background: 'rgba(255,255,255,0.06)', color: C.text }}
            >
              {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
              {uploading ? 'Uploading…' : 'Upload video'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
