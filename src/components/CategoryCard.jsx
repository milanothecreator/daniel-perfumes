import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProducts } from '../context/ProductsContext'

export default function CategoryCard({ category }) {
  const { getProductsByCategory } = useProducts()
  const count = getProductsByCategory(category.slug).length

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Link
        to={`/category/${category.slug}`}
        className="block card-dark overflow-hidden group relative h-48 sm:h-56"
      >
        {/* Background */}
        <div
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
          style={{
            background: `linear-gradient(145deg, ${category.color} 0%, #0a0a0a 100%)`,
          }}
        />
        {/* Glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle at 30% 50%, ${category.accent}, transparent 70%)` }}
        />

        {/* Content */}
        <div className="relative h-full p-5 flex flex-col justify-between">
          <span
            className="text-4xl"
            style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' }}
          >
            {category.icon}
          </span>
          <div>
            <h3 className="font-display text-dp-cream text-2xl group-hover:text-dp-gold transition-colors duration-300">
              {category.name}
            </h3>
            <p className="font-body text-xs text-dp-muted mt-1 line-clamp-2">
              {category.description}
            </p>
            <p className="font-body text-[11px] mt-2" style={{ color: category.accent }}>
              {count} fragrances →
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
