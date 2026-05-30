import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { generalWhatsApp } from '../lib/whatsapp'

const values = [
  { icon: '✦', title: 'Authenticity', desc: 'Every fragrance we sell is 100% original. No imitations, no compromises.' },
  { icon: '🌍', title: 'Locally Rooted', desc: 'Based in Kampala, we understand what resonates with the Ugandan lifestyle.' },
  { icon: '👑', title: 'Premium Quality', desc: 'We source only from trusted fragrance houses. Quality you can smell and feel.' },
  { icon: '💬', title: 'Personal Service', desc: 'Real people, real conversations. Order via WhatsApp and feel the difference.' },
]

export default function About() {
  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <p className="font-body text-dp-gold text-xs tracking-[0.4em] uppercase mb-4">Our Story</p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-dp-cream leading-tight mb-6">
            Born in <span className="text-dp-gold italic">Kampala.</span>
            <br />Made for the World.
          </h1>
          <p className="font-body text-dp-muted text-lg max-w-xl mx-auto leading-relaxed">
            Daniel Perfumes is Uganda's home of original, premium fragrances — bringing the world's
            finest scents to your doorstep.
          </p>
        </motion.div>

        {/* Story section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-12 mb-20 items-center"
        >
          {/* Large decorative element */}
          <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden card-dark flex items-center justify-center">
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(145deg, #D4C0A8 0%, #F7F4EF 100%)' }}
            />
            <div
              className="absolute inset-0 opacity-60"
              style={{ background: 'radial-gradient(circle at 40% 50%, #9A752018, transparent 70%)' }}
            />
            <span className="relative font-display text-8xl text-dp-gold/30 select-none tracking-tighter">D P</span>
          </div>

          <div>
            <h2 className="font-display text-3xl text-dp-cream mb-5">
              The <span className="text-dp-gold italic">Daniel Perfumes</span> Story
            </h2>
            <p className="font-body text-dp-muted leading-relaxed mb-4">
              Founded with a passion for authentic fragrance, Daniel Perfumes set out to change how
              Ugandans experience perfume. No more settling for imitations or overpriced imports —
              we bring you the real thing, at honest prices.
            </p>
            <p className="font-body text-dp-muted leading-relaxed mb-4">
              From the bustling markets of Kampala, we've built a community of fragrance lovers who
              believe that scent is personal, powerful, and deeply connected to identity.
            </p>
            <p className="font-body text-dp-muted leading-relaxed">
              Our catalogue spans four scent families — Woody, Warm, Fresh, and Oriental — curated
              from the world's finest fragrance houses including Lattafa and more.
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <div className="text-center mb-10">
            <p className="font-body text-dp-gold text-xs tracking-[0.4em] uppercase mb-3">What We Stand For</p>
            <h2 className="section-title">Our Values</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-dark p-6"
              >
                <span className="text-2xl mb-4 block">{v.icon}</span>
                <h3 className="font-display text-dp-cream text-xl mb-2">{v.title}</h3>
                <p className="font-body text-dp-muted text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact / CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-3xl overflow-hidden border border-dp-gold/30 p-8 sm:p-12 text-center"
          style={{ background: 'linear-gradient(135deg, #EDE5D5 0%, #F5F0E8 60%, #E8EDF0 100%)' }}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, #9A752010, transparent 60%)' }}
          />
          <div className="relative">
            <h2 className="font-display text-3xl sm:text-4xl text-dp-cream mb-4">
              Let's Find Your <span className="text-dp-gold italic">Signature Scent</span>
            </h2>
            <p className="font-body text-dp-muted max-w-sm mx-auto mb-4 leading-relaxed">
              WhatsApp us and our team will personally help you find the perfect fragrance.
              Orders delivered across Uganda.
            </p>
            <div className="mb-6 space-y-1">
              <p className="font-body text-sm text-dp-muted">📍 Kampala, Uganda</p>
              <p className="font-body text-sm">
                <a href="tel:+256755195151" className="text-dp-gold hover:text-dp-gold-light transition-colors">
                  +256 755 195 151
                </a>
              </p>
              <p className="font-body text-sm">
                <a
                  href="https://www.instagram.com/danielperfumes_ug/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dp-muted hover:text-dp-gold transition-colors"
                >
                  @danielperfumes_ug
                </a>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={generalWhatsApp()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
              >
                WhatsApp Us
              </a>
              <Link to="/quiz" className="btn-outline">
                Take the Scent Quiz
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
