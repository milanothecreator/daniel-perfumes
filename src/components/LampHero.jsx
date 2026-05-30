import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const BG_SOLID = '#040F1F'
const GLOW     = '#38BDF8'

const flickerOpacity = [1, 0.85, 1, 0.04, 1, 0.8, 0.02, 0.78, 0.03, 1, 0.9, 1]
const flickerTimes   = [0, 0.07, 0.14, 0.22, 0.3, 0.44, 0.52, 0.6, 0.68, 0.76, 0.88, 1]
const flickerTransition = {
  delay: 1.2,
  duration: 0.65,
  repeat: Infinity,
  repeatDelay: 3.2,
  times: flickerTimes,
  ease: 'linear',
}

// Entrance: beams/glows expand once on load
const entranceTransition = { delay: 0.3, duration: 0.8, ease: 'easeInOut' }

export default function LampHero() {
  return (
    <section className="px-4 pb-5">
      <div
        className="relative flex flex-col items-center overflow-hidden w-full rounded-3xl"
        style={{
          background: 'linear-gradient(175deg, #040F1F 0%, #0A2A4A 45%, #0E5280 100%)',
          minHeight: 320,
        }}
      >
        {/* ── Lamp light layer ── */}
        <div
          className="relative flex w-full items-center justify-center"
          style={{ height: 200, transform: 'scaleY(1.25)', transformOrigin: 'top', flexShrink: 0, mixBlendMode: 'screen' }}
        >
          {/* Left conic beam — outer expands once, inner flickers */}
          <motion.div
            initial={{ width: '6rem' }}
            animate={{ width: '18rem' }}
            transition={entranceTransition}
            className="absolute inset-auto right-1/2 overflow-visible"
            style={{ height: 148 }}
          >
            <motion.div
              animate={{ opacity: flickerOpacity }}
              transition={flickerTransition}
              className="w-full h-full overflow-visible"
              style={{ backgroundImage: `conic-gradient(from 70deg at center top, ${GLOW}, transparent, transparent)` }}
            >
              <div className="absolute w-full left-0 bottom-0 z-20"
                style={{ height: 100, background: `linear-gradient(to top, ${BG_SOLID}, transparent)` }} />
            </motion.div>
          </motion.div>

          {/* Right conic beam — outer expands once, inner flickers */}
          <motion.div
            initial={{ width: '6rem' }}
            animate={{ width: '18rem' }}
            transition={entranceTransition}
            className="absolute inset-auto left-1/2 overflow-visible"
            style={{ height: 148 }}
          >
            <motion.div
              animate={{ opacity: flickerOpacity }}
              transition={flickerTransition}
              className="w-full h-full overflow-visible"
              style={{ backgroundImage: `conic-gradient(from 290deg at center top, transparent, transparent, ${GLOW})` }}
            >
              <div className="absolute w-full right-0 bottom-0 z-20"
                style={{ height: 100, background: `linear-gradient(to top, ${BG_SOLID}, transparent)` }} />
            </motion.div>
          </motion.div>

          {/* Bottom cover blur — stable mask */}
          <div
            className="absolute top-1/2 h-40 w-full blur-2xl"
            style={{ background: BG_SOLID, transform: 'translateY(36px) scaleX(1.5)' }}
          />

          {/* Large glow blob — flickers */}
          <motion.div
            animate={{ opacity: flickerOpacity }}
            transition={flickerTransition}
            className="absolute top-1/2 z-50 rounded-full blur-3xl"
            style={{ height: 112, width: 256, background: GLOW, opacity: 0.28, transform: 'translateY(-50%)' }}
          />

          {/* Small bright glow spot — outer expands once, inner flickers */}
          <motion.div
            initial={{ width: '4rem' }}
            animate={{ width: '8rem' }}
            transition={entranceTransition}
            className="absolute inset-auto z-30 rounded-full blur-2xl"
            style={{ height: 96, transform: 'translateY(-68px)' }}
          >
            <motion.div
              animate={{ opacity: flickerOpacity }}
              transition={flickerTransition}
              className="w-full h-full rounded-full"
              style={{ background: GLOW, opacity: 0.65 }}
            />
          </motion.div>

          {/* Horizontal lamp fixture line — outer expands once, inner flickers */}
          <motion.div
            initial={{ width: '8rem' }}
            animate={{ width: '22rem' }}
            transition={entranceTransition}
            className="absolute inset-auto z-50 overflow-hidden"
            style={{ height: 1.5, transform: 'translateY(-70px)', borderRadius: 1 }}
          >
            <motion.div
              animate={{ opacity: flickerOpacity }}
              transition={flickerTransition}
              className="w-full h-full"
              style={{ background: GLOW, opacity: 0.2 }}
            />
          </motion.div>

          {/* Top dark cover — fades out at bottom so there's no hard seam */}
          <div
            className="absolute inset-auto z-40 w-full"
            style={{ height: 140, background: `linear-gradient(to bottom, ${BG_SOLID} 65%, transparent)`, transform: 'translateY(-126px)' }}
          />
        </div>

        {/* ── Frosted glass content panel ── */}
        <div className="relative z-10 flex flex-col items-center px-5 pb-8 text-center w-full max-w-xs mx-auto"
          style={{ marginTop: -8 }}>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.65, ease: 'easeOut' }}
            className="w-full flex flex-col items-center rounded-2xl px-6 py-5"
            style={{
              background: 'rgba(4, 20, 45, 0.55)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.18)',
            }}
          >
            <p
              className="font-body text-[9px] tracking-[0.45em] uppercase mb-3"
              style={{ color: `${GLOW}cc` }}
            >
              Kampala, Uganda
            </p>
            <h1
              className="font-display tracking-widest mb-2"
              style={{ fontSize: '1.9rem', lineHeight: 1.15, color: 'white' }}
            >
              DANIEL PERFUMES
            </h1>
            <p
              className="font-body text-xs mb-5 max-w-[200px]"
              style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}
            >
              Premium originals from Kampala, Uganda
            </p>
            <div className="flex items-center gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-1.5 font-body text-xs font-semibold px-5 py-2.5 rounded-full transition-all active:scale-95 hover:opacity-90"
                style={{ background: GLOW, color: '#040F1F' }}
              >
                Shop Now
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/quiz"
                className="font-body text-xs font-medium transition-colors"
                style={{ color: `${GLOW}bb` }}
              >
                Take the Quiz →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
