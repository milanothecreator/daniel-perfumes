import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Check, ChevronLeft, Trophy } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import ShaderBackground from '../components/ui/shader-background'
import Loader from '../components/ui/loader'
import { useProducts } from '../context/ProductsContext'

// ── Questions ─────────────────────────────────────────────────────────────────
const questions = [
  {
    id: 'personality', label: 'Your Personality',
    question: 'How would you describe yourself?',
    options: [
      { label: 'Bold & Confident',   value: 'bold',    scores: { woody: 3, oriental: 2, warm: 1, fresh: 0 } },
      { label: 'Calm & Peaceful',    value: 'calm',    scores: { fresh: 3, woody: 1, warm: 1, oriental: 0 } },
      { label: 'Playful & Fun',      value: 'playful', scores: { fresh: 2, warm: 2, woody: 1, oriental: 1 } },
      { label: 'Deep & Mysterious',  value: 'deep',    scores: { oriental: 3, warm: 2, woody: 2, fresh: 0 } },
    ],
  },
  {
    id: 'time', label: 'Your Rhythm',
    question: "What's your favourite time of day?",
    options: [
      { label: 'Early Morning', value: 'dawn',  scores: { fresh: 3, woody: 1, warm: 0, oriental: 0 } },
      { label: 'Afternoon',     value: 'day',   scores: { fresh: 2, woody: 1, warm: 1, oriental: 0 } },
      { label: 'Golden Hour',   value: 'dusk',  scores: { warm: 3, woody: 2, oriental: 1, fresh: 0 } },
      { label: 'Late Night',    value: 'night', scores: { oriental: 3, warm: 2, woody: 1, fresh: 0 } },
    ],
  },
  {
    id: 'setting', label: 'Your World',
    question: 'Pick a setting that feels like you.',
    options: [
      { label: 'Dense Forest',     value: 'forest', scores: { woody: 4, fresh: 1, warm: 0, oriental: 0 } },
      { label: 'Spice Market',     value: 'spice',  scores: { oriental: 3, warm: 2, woody: 1, fresh: 0 } },
      { label: 'Ocean Shore',      value: 'ocean',  scores: { fresh: 4, woody: 1, warm: 0, oriental: 0 } },
      { label: 'Desert at Sunset', value: 'desert', scores: { warm: 3, oriental: 2, woody: 1, fresh: 0 } },
    ],
  },
  {
    id: 'occasion', label: 'Your Lifestyle',
    question: 'When do you wear fragrance most?',
    options: [
      { label: 'Every Day',      value: 'everyday', scores: { fresh: 2, woody: 2, warm: 1, oriental: 0 } },
      { label: 'Date Night',     value: 'date',     scores: { warm: 3, oriental: 2, woody: 1, fresh: 0 } },
      { label: 'Work & Office',  value: 'work',     scores: { woody: 2, fresh: 2, warm: 1, oriental: 0 } },
      { label: 'Special Events', value: 'special',  scores: { oriental: 3, warm: 2, woody: 1, fresh: 0 } },
    ],
  },
  {
    id: 'longevity', label: 'Your Preference',
    question: 'How long should your scent linger?',
    options: [
      { label: 'Light & Airy',              value: 'light',   scores: { fresh: 3, woody: 0, warm: 0, oriental: 0 } },
      { label: 'All Day Presence',           value: 'allday',  scores: { woody: 2, warm: 2, fresh: 1, oriental: 1 } },
      { label: 'Intense & Unforgettable',    value: 'intense', scores: { oriental: 3, warm: 2, woody: 1, fresh: 0 } },
    ],
  },
  {
    id: 'season', label: 'Your Season',
    question: 'Which season captures your style?',
    options: [
      { label: 'Spring — Fresh & Alive',  value: 'spring', scores: { fresh: 3, warm: 1, woody: 1, oriental: 0 } },
      { label: 'Summer — Bright & Warm',  value: 'summer', scores: { fresh: 2, warm: 2, woody: 0, oriental: 1 } },
      { label: 'Autumn — Rich & Earthy',  value: 'autumn', scores: { woody: 3, warm: 2, oriental: 1, fresh: 0 } },
      { label: 'Winter — Dark & Intense', value: 'winter', scores: { oriental: 3, warm: 2, woody: 2, fresh: 0 } },
    ],
  },
  {
    id: 'colour', label: 'Your Palette',
    question: 'Which colour speaks to your soul?',
    options: [
      { label: 'Deep Forest Green', value: 'green',  scores: { woody: 3, fresh: 2, warm: 0, oriental: 0 } },
      { label: 'Ocean Blue',        value: 'blue',   scores: { fresh: 3, woody: 1, warm: 0, oriental: 0 } },
      { label: 'Molten Gold',       value: 'gold',   scores: { warm: 3, oriental: 2, woody: 1, fresh: 0 } },
      { label: 'Midnight Purple',   value: 'purple', scores: { oriental: 3, warm: 1, woody: 1, fresh: 0 } },
    ],
  },
  {
    id: 'texture', label: 'Your Ideal',
    question: 'Describe your perfect scent in one word.',
    options: [
      { label: 'Earthy',   value: 'earthy',  scores: { woody: 4, fresh: 0, warm: 1, oriental: 1 } },
      { label: 'Sweet',    value: 'sweet',   scores: { warm: 3, oriental: 2, woody: 0, fresh: 1 } },
      { label: 'Crisp',    value: 'crisp',   scores: { fresh: 4, woody: 1, warm: 0, oriental: 0 } },
      { label: 'Exotic',   value: 'exotic',  scores: { oriental: 4, warm: 1, woody: 1, fresh: 0 } },
    ],
  },
  {
    id: 'mood', label: 'Your Impression',
    question: 'What feeling do you want to leave in a room?',
    options: [
      { label: 'Energised & Uplifted',     value: 'energy',  scores: { fresh: 3, woody: 1, warm: 1, oriental: 0 } },
      { label: 'Confident & Powerful',     value: 'power',   scores: { woody: 3, oriental: 2, warm: 1, fresh: 0 } },
      { label: 'Warm & Irresistible',      value: 'warmth',  scores: { warm: 3, oriental: 2, woody: 1, fresh: 0 } },
      { label: 'Mysterious & Intriguing',  value: 'mystery', scores: { oriental: 3, warm: 2, woody: 1, fresh: 0 } },
    ],
  },
  {
    id: 'budget', label: 'Your Investment',
    question: 'What is your fragrance budget?',
    isBudget: true,
    options: [
      { label: 'Under 160,000 UGX',      value: 'low' },
      { label: '160,000 – 185,000 UGX',  value: 'mid' },
      { label: 'No Limit — Best Only',    value: 'any' },
    ],
  },
]

// ── Dynamic explanation variants ──────────────────────────────────────────────
const explanationPool = {
  woody: {
    bold: [
      "Your commanding energy calls for deep, ancient woods — cedarwood and oud that announce your arrival without saying a word.",
      "Bold souls wear bold scents. These smoky cedarwood depths mirror your unapologetic confidence — grounded and unforgettable.",
      "The forest carved these notes for someone like you — powerful, unhurried, deeply certain of who they are.",
    ],
    calm: [
      "Grounded cedarwood and sandalwood reflect your serene nature — a quiet strength that draws people closer without effort.",
      "These forest notes settle like your energy — still, warm, and deeply reassuring to everyone around you.",
      "Soft woody notes match your steady presence. Clean earth and warm cedar: sophisticated, never loud.",
    ],
    playful: [
      "Warm wood notes add sophisticated depth to your playful spirit — a scent that surprises as much as you do.",
      "Light woods and bark bring an earthy edge to your bright personality. Natural, spontaneous, genuinely you.",
      "A woody warmth that grounds your playful energy, leaving a trail people can't help but follow.",
    ],
    deep: [
      "Smoky, earthy woods mirror your thoughtful and mysterious character — rich, complex, impossible to fully define.",
      "Ancient trees hold secrets the way you do. These dark wood notes speak your language without words.",
      "Oud and cedarwood carry the same gravity as your presence — deep, aged, and endlessly fascinating.",
    ],
  },
  warm: {
    bold: [
      "Rich amber and spice make a confident statement wherever you go — a scent as unapologetic as you are.",
      "Bold and warm: amber's heat matches your energy. You don't enter a room quietly, and neither does this.",
      "Spiced warmth wraps your confidence in something irresistible. People remember bold people and bold scents.",
    ],
    calm: [
      "Soft vanilla and musk suit your gentle energy — warm without demanding attention, deeply comforting.",
      "Like a slow, warm evening, this fragrance settles into your skin and stays, quietly beautiful.",
      "Creamy warmth for a calming soul. Vanilla and amber melt together the way you put others at ease.",
    ],
    playful: [
      "Sweet, warm notes add irresistible charm — a scent that smiles before you do.",
      "Caramel and soft musk carry your fun energy all day long — warm, inviting, always in a good mood.",
      "This fragrance is as warm and infectious as your personality. People are drawn to it just like they're drawn to you.",
    ],
    deep: [
      "Sensual warmth perfectly complements your intense, layered nature — rich, complex, impossible to ignore.",
      "Amber and spice for a soul that runs deep. This fragrance reveals itself slowly, just like you do.",
      "Your depth deserves a scent with layers. Warm resins and dark vanilla — every hour reveals something new.",
    ],
  },
  fresh: {
    bold: [
      "Clean citrus and aquatic notes give your bold personality an effortlessly cool edge — confident without effort.",
      "Bright and clean: this is boldness without noise. Fresh notes that cut through any room with clarity.",
      "Sharp bergamot and ocean air match your decisive energy. Fresh, strong, leaves an impression.",
    ],
    calm: [
      "Light, airy fresh notes perfectly match your calm, balanced energy — clean as a clear morning sky.",
      "Cool citrus and white tea mirror your tranquil spirit. Effortless and pure, never demanding.",
      "These fresh notes breathe the same peace you carry. Green, clean, and completely at ease.",
    ],
    playful: [
      "Bright, lively citrus notes embody your fun and uplifting spirit — a scent that actually smiles.",
      "Aqua and grapefruit sparkle as much as your personality. Light, joyful, absolutely irresistible.",
      "This fragrance has your energy — bouncy, fresh, and impossible to be in a bad mood around.",
    ],
    deep: [
      "Crisp fresh scents offer a surprising, captivating contrast to your depth — unexpected and memorable.",
      "The clearest water runs deepest. These aquatic notes carry quiet complexity that rewards attention.",
      "A fresh paradox: bright on the surface, layered underneath — just like the way people discover you.",
    ],
  },
  oriental: {
    bold: [
      "Intense oud and exotic spices match your powerful, commanding presence — ancient, rare, undeniable.",
      "The spice routes were built by bold people for bold statements. This fragrance carries that legacy.",
      "Oriental depth for an extraordinary personality. Saffron and oud that own every space they enter.",
    ],
    calm: [
      "Exotic resins and rich florals add quiet mystique to your peaceful nature — deeply soothing yet complex.",
      "Ancient incense and rose carry a spiritual calm that mirrors your tranquil energy perfectly.",
      "These oriental notes settle slowly and stay gently — a thoughtful fragrance for a thoughtful soul.",
    ],
    playful: [
      "Oriental warmth adds a surprising, captivating layer to your fun side — a scent with an exciting secret.",
      "Spice and warmth with a playful twist. This fragrance keeps people guessing, just like you do.",
      "You're full of surprises — so is this fragrance. Oriental richness that warms every moment you're in.",
    ],
    deep: [
      "Rich incense and ancient myrrh perfectly echo your mysterious soul — layered, rare, unforgettable.",
      "Oud and saffron for someone who lives in the depths. This fragrance only reveals itself to those who wait.",
      "Your soul vibrates on the same frequency as ancient incense. This scent was made for someone like you.",
    ],
  },
}

function pickExplanation(category, personality) {
  const variants = explanationPool[category]?.[personality]
  if (!variants?.length) return `${category} fragrances resonate deeply with your unique energy.`
  return variants[Math.floor(Math.random() * variants.length)]
}

// ── Headline map ──────────────────────────────────────────────────────────────
const headlineMap = {
  bold:    { forest: 'Power of Ancient Forests', spice: 'Bold Spice & Dark Oud',   ocean: 'Confident Fresh Horizons', desert: 'Desert Gold & Conquest',   spring: 'Bold Spring Energy',    summer: 'Fearless Summer Heat',  autumn: 'Bold Autumn Embers',     winter: 'Dark Winter Force'       },
  calm:    { forest: 'Serene Forest Wanderer',   spice: 'Calm Spice Dreamer',      ocean: 'Peaceful Ocean Breeze',    desert: 'Still Desert Dawn',        spring: 'Gentle Spring Bloom',   summer: 'Calm Summer Light',     autumn: 'Peaceful Autumn Haze',   winter: 'Quiet Winter Serenity'   },
  playful: { forest: 'Free Spirit of the Woods', spice: 'Playful Spice & Warmth',  ocean: 'Bright Coastal Energy',    desert: 'Sunny Desert Rose',        spring: 'Joyful Spring Air',     summer: 'Carefree Summer Sun',   autumn: 'Warm Autumn Play',       winter: 'Cosy Winter Magic'       },
  deep:    { forest: 'Soul of the Dark Forest',  spice: 'Mystic Spice & Incense',  ocean: 'Deep Blue Mystery',        desert: 'Secrets of the Dunes',     spring: 'Hidden Spring Depths',  summer: 'Summer Night Mystery',  autumn: 'Deep Autumn Soul',       winter: 'Ancient Winter Rites'    },
}

// ── Scoring engine ────────────────────────────────────────────────────────────
const LONGEVITY_MAP   = { light: 'Light & fresh', allday: 'All day', intense: 'Intense & lingering' }
const PRICE_MAX       = { low: 159999, mid: 185000, any: Infinity }
const LONGEVITY_BONUS = 2

function computeCatMax() {
  const maxes = { woody: 0, warm: 0, fresh: 0, oriental: 0 }
  questions.filter(q => !q.isBudget).forEach(q => {
    const best = { woody: 0, warm: 0, fresh: 0, oriental: 0 }
    q.options.forEach(opt => {
      if (!opt.scores) return
      Object.entries(opt.scores).forEach(([cat, val]) => { if (val > best[cat]) best[cat] = val })
    })
    Object.keys(maxes).forEach(cat => { maxes[cat] += best[cat] })
  })
  return maxes
}
const CAT_MAX = computeCatMax()

function getRecommendations(answers, products) {
  const catScore = { woody: 0, warm: 0, fresh: 0, oriental: 0 }
  questions.filter(q => !q.isBudget).forEach(q => {
    const opt = q.options.find(o => o.value === answers[q.id])
    if (!opt?.scores) return
    Object.entries(opt.scores).forEach(([cat, pts]) => { catScore[cat] += pts })
  })

  const priceLimit = PRICE_MAX[answers.budget] ?? Infinity

  const scored = products.map(p => {
    const raw    = catScore[p.category] || 0
    const lonB   = (answers.longevity && p.longevity === LONGEVITY_MAP[answers.longevity]) ? LONGEVITY_BONUS : 0
    const budget = p.price > priceLimit ? -50 : 0
    const maxPos = (CAT_MAX[p.category] || 1) + LONGEVITY_BONUS
    const matchPct = Math.min(99, Math.max(12, Math.round((raw + lonB) / maxPos * 100)))
    return { product: p, totalScore: raw + lonB + budget, matchPct }
  })

  const sorted = scored.sort((a, b) => b.totalScore - a.totalScore)
  const result = []; const usedCats = new Set()
  for (const item of sorted) {
    if (result.length >= 3) break
    if (!usedCats.has(item.product.category)) { result.push(item); usedCats.add(item.product.category) }
  }
  for (const item of sorted) {
    if (result.length >= 3) break
    if (!result.find(r => r.product.id === item.product.id)) result.push(item)
  }

  const personality = answers.personality || 'bold'
  return result.slice(0, 3).map(({ product, matchPct }) => ({
    product, matchPct,
    reason: pickExplanation(product.category, personality),
  }))
}

function getTier(topPct) {
  if (topPct >= 88) return { label: 'Parfumeur',   sub: 'Supreme Scent Mastery',    color: '#A78BFA' }
  if (topPct >= 72) return { label: 'Aficionado',  sub: 'Refined Taste Confirmed',   color: '#8B5CF6' }
  if (topPct >= 55) return { label: 'Connoisseur', sub: 'Growing Scent Wisdom',      color: '#7C3AED' }
  return               { label: 'Explorer',    sub: 'Your Scent Journey Begins', color: '#6D28D9' }
}

// ── Animations ────────────────────────────────────────────────────────────────
const slide = {
  enter:  dir => ({ x: dir > 0 ? 56 : -56, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   dir => ({ x: dir > 0 ? -56 : 56, opacity: 0 }),
}

// ── CircleProgress ────────────────────────────────────────────────────────────
function CircleProgress({ current, total }) {
  const r = 44, circ = 2 * Math.PI * r
  const offset = circ * (1 - current / total)
  return (
    <div className="relative w-[100px] h-[100px]">
      <svg className="w-full h-full" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
        <motion.circle cx="50" cy="50" r={r} fill="none" stroke="#8B5CF6" strokeWidth="7"
          strokeLinecap="round" strokeDasharray={circ}
          animate={{ strokeDashoffset: offset }} transition={{ duration: 0.5 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl text-white leading-none">{String(current).padStart(2, '0')}</span>
        <span className="font-body text-[9px] mt-0.5 tracking-wide" style={{ color: 'rgba(255,255,255,0.35)' }}>of {total}</span>
      </div>
    </div>
  )
}

// ── Loading screen ────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 px-4" style={{ zIndex: 1 }}>
      <div className="relative w-[200px] h-[200px]">
        <Loader />
      </div>
      <motion.p
        className="font-display text-2xl"
        style={{ color: '#A78BFA' }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
      >
        Reading your soul…
      </motion.p>
      <p className="font-body text-sm text-center max-w-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
        Our master perfumer is crafting your personal scent profile.
      </p>
    </div>
  )
}

// ── Results screen ────────────────────────────────────────────────────────────
function ResultsScreen({ results, onRestart }) {
  const topPct = results.recommendations[0]?.matchPct || 0
  const tier   = getTier(topPct)

  const matchColors = ['#A78BFA', '#8B5CF6', '#7C3AED']

  return (
    <main className="relative min-h-screen pt-20 pb-24" style={{ zIndex: 1 }}>
      <div className="max-w-lg mx-auto px-4">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border"
              style={{ background: `${tier.color}18`, borderColor: `${tier.color}40`, color: tier.color }}>
              <Trophy size={12} />
              <span className="font-body text-[11px] font-semibold tracking-widest uppercase">{tier.label}</span>
            </div>
          </div>
          <p className="font-body text-[10px] tracking-[0.4em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>Your Result</p>
          <h1 className="font-display text-3xl text-white mb-1.5">{results.headline}</h1>
          <p className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{tier.sub} · {results.recommendations.length} fragrances matched</p>
        </motion.div>

        {/* Recommendations */}
        <div className="flex flex-col gap-7 mb-8">
          {results.recommendations.map(({ product, matchPct, reason }, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.18 }}>

              {/* Match bar */}
              <div className="flex items-center gap-2.5 mb-2.5 px-0.5">
                <span className="font-display text-lg leading-none shrink-0" style={{ color: matchColors[i] }}>
                  {matchPct}%
                </span>
                <span className="font-body text-[9px] uppercase tracking-widest shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }}>Match</span>
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <motion.div className="h-full rounded-full"
                    style={{ background: matchColors[i] }}
                    initial={{ width: 0 }} animate={{ width: `${matchPct}%` }}
                    transition={{ delay: i * 0.18 + 0.35, duration: 0.9 }} />
                </div>
                {i === 0 && (
                  <span className="font-body text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: 'rgba(139,92,246,0.15)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.3)' }}>
                    Best Match
                  </span>
                )}
              </div>

              <ProductCard product={product} />

              {/* Scent notes chips */}
              <div className="mt-2 flex flex-wrap gap-1.5 px-0.5">
                {[...product.notes.top.split(', '), ...product.notes.heart.split(', ')].slice(0, 4).map(note => (
                  <span key={note} className="font-body text-[10px] px-2.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                    {note}
                  </span>
                ))}
              </div>

              {/* Why this scent */}
              <div className="mt-2 rounded-2xl px-4 py-3.5"
                style={{
                  background: 'rgba(0,0,0,0.35)',
                  backdropFilter: 'blur(12px)',
                  borderLeft: `2px solid ${i === 0 ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  borderRight: '1px solid rgba(255,255,255,0.06)',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}>
                <p className="font-body text-[10px] uppercase tracking-widest mb-1.5" style={{ color: '#A78BFA' }}>Why this scent</p>
                <p className="font-body text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{reason}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            to="/shop"
            className="text-center py-4 rounded-full font-body font-semibold tracking-widest text-sm uppercase text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', boxShadow: '0 0 24px rgba(124,58,237,0.35)' }}
          >
            Browse All Fragrances
          </Link>
          <button
            onClick={onRestart}
            className="py-4 rounded-full font-body font-semibold tracking-widest text-sm uppercase transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}
          >
            Retake Quiz
          </button>
        </div>
      </div>
    </main>
  )
}

// ── Main Quiz ─────────────────────────────────────────────────────────────────
export default function Quiz() {
  const [step, setStep]           = useState(0)
  const [answers, setAnswers]     = useState({})
  const [direction, setDirection] = useState(1)
  const [loading, setLoading]     = useState(false)
  const [results, setResults]     = useState(null)
  const { products }              = useProducts()

  const current = questions[step]
  const total   = questions.length

  function select(id, value) { setAnswers(a => ({ ...a, [id]: value })) }

  function next() {
    if (!answers[current.id]) return
    if (step < total - 1) { setDirection(1); setStep(s => s + 1) }
    else finish()
  }

  function back() {
    if (step > 0) { setDirection(-1); setStep(s => s - 1) }
  }

  function finish() {
    setLoading(true)
    setTimeout(() => {
      const recs  = getRecommendations(answers, products)
      const pers  = answers.personality || 'bold'
      const loc   = answers.setting || answers.season || 'forest'
      const headline = headlineMap[pers]?.[loc] || 'Your Signature Scent Awaits'
      setResults({ recommendations: recs, headline })
      setLoading(false)
    }, 2800)
  }

  function restart() { setStep(0); setAnswers({}); setResults(null); setDirection(1) }

  return (
    <>
      <ShaderBackground />

      {loading && <LoadingScreen />}

      {!loading && results && <ResultsScreen results={results} onRestart={restart} />}

      {!loading && !results && (
        <main className="relative min-h-screen pt-16 pb-28 flex flex-col" style={{ zIndex: 1 }}>
          <div className="flex-1 max-w-lg mx-auto w-full px-4 flex flex-col">

            {/* Header */}
            <div className="flex items-center pt-5 mb-6">
              <div className="w-9 shrink-0">
                {step > 0 && (
                  <button onClick={back}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                    <ChevronLeft size={16} />
                  </button>
                )}
              </div>
              <p className="flex-1 text-center font-body text-[11px] tracking-[0.2em] uppercase"
                style={{ color: 'rgba(255,255,255,0.35)' }}>
                Scent Profile
              </p>
              <div className="w-9" />
            </div>

            {/* Circle progress */}
            <div className="flex justify-center mb-7">
              <CircleProgress current={step + 1} total={total} />
            </div>

            {/* Question card + options */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={step} custom={direction} variants={slide}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ willChange: 'transform, opacity' }}
                className="flex flex-col gap-2.5">

                {/* Card */}
                <div className="rounded-3xl overflow-hidden"
                  style={{
                    background: 'rgba(10, 5, 30, 0.55)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                  <div className="px-5 pt-4 pb-0">
                    <span className="inline-flex items-center gap-1.5 font-body text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full"
                      style={{ color: '#C4B5FD', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(167,139,250,0.2)' }}>
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#8B5CF6' }} />
                      {current.label}
                    </span>
                  </div>
                  <div className="px-5 pt-3 pb-5">
                    <h2 className="font-display text-xl sm:text-[22px] text-white leading-snug">
                      {current.question}
                    </h2>
                  </div>
                </div>

                {/* Options */}
                <div className="flex flex-col gap-2">
                  {current.options.map((opt, idx) => {
                    const sel    = answers[current.id] === opt.value
                    const letter = 'ABCD'[idx] ?? String(idx + 1)
                    return (
                      <button key={opt.value} onClick={() => select(current.id, opt.value)}
                        className="w-full flex items-center gap-3 px-4 py-[14px] rounded-2xl transition-all duration-200 active:scale-[0.985]"
                        style={sel ? {
                          background: 'rgba(124,58,237,0.22)',
                          border: '1px solid rgba(167,139,250,0.55)',
                        } : {
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.09)',
                        }}>

                        {/* Letter badge */}
                        <span className="w-8 h-8 rounded-xl flex items-center justify-center font-body text-xs font-bold shrink-0 transition-all duration-200"
                          style={sel ? {
                            background: '#8B5CF6',
                            color: '#fff',
                          } : {
                            background: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.45)',
                          }}>
                          {letter}
                        </span>

                        {/* Label */}
                        <span className="font-body text-sm flex-1 text-left leading-snug transition-all duration-200"
                          style={{ color: sel ? '#DDD6FE' : 'rgba(255,255,255,0.82)' }}>
                          {opt.label}
                        </span>

                        {/* Check circle */}
                        <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200"
                          style={sel ? { background: '#8B5CF6', borderColor: '#8B5CF6' } : { borderColor: 'rgba(255,255,255,0.18)' }}>
                          {sel && <Check size={13} color="#fff" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex-1 min-h-5" />

            {/* Next button */}
            <button onClick={next} disabled={!answers[current.id]}
              className="w-full py-4 rounded-full font-body font-semibold tracking-widest text-sm uppercase transition-all duration-200"
              style={answers[current.id] ? {
                background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                color: '#fff',
                boxShadow: '0 0 28px rgba(124,58,237,0.4)',
              } : {
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.22)',
                cursor: 'not-allowed',
              }}>
              {step === total - 1 ? 'Reveal My Scent ✦' : 'Next →'}
            </button>

          </div>
        </main>
      )}
    </>
  )
}
