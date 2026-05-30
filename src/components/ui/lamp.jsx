import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export const LampContainer = ({ children, className }) => {
  return (
    <div
      className={cn(
        'relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-dp-bg w-full z-0',
        className
      )}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">

        {/* ── Left conic beam ── */}
        <motion.div
          initial={{ opacity: 0.5, width: '8rem' }}
          animate={{ opacity: 1, width: '18rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto right-1/2 h-48 sm:h-56 overflow-visible
                     from-[#C9A96E] via-transparent to-transparent
                     text-white [--conic-position:from_70deg_at_center_top]
                     w-[18rem] sm:w-[26rem] md:w-[30rem]"
        >
          <div className="absolute w-full left-0 bg-dp-bg h-32 sm:h-40 bottom-0 z-20
                          [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-28 sm:w-40 h-full left-0 bg-dp-bg bottom-0 z-20
                          [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>

        {/* ── Right conic beam ── */}
        <motion.div
          initial={{ opacity: 0.5, width: '8rem' }}
          animate={{ opacity: 1, width: '18rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto left-1/2 h-48 sm:h-56 overflow-visible
                     from-transparent via-transparent to-[#C9A96E]
                     text-white [--conic-position:from_290deg_at_center_top]
                     w-[18rem] sm:w-[26rem] md:w-[30rem]"
        >
          <div className="absolute w-28 sm:w-40 h-full right-0 bg-dp-bg bottom-0 z-20
                          [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-full right-0 bg-dp-bg h-32 sm:h-40 bottom-0 z-20
                          [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        {/* ── Background blur washes ── */}
        <div className="absolute top-1/2 h-40 sm:h-48 w-full translate-y-12 scale-x-150 bg-dp-bg blur-2xl" />
        <div className="absolute top-1/2 z-50 h-40 sm:h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />

        {/* ── Central gold glow ── */}
        <div className="absolute inset-auto z-50 h-28 sm:h-36 w-[16rem] sm:w-[24rem] md:w-[28rem]
                        -translate-y-1/2 rounded-full bg-[#C9A96E] opacity-30 sm:opacity-50 blur-3xl" />

        {/* ── Bright centre spot ── */}
        <motion.div
          initial={{ width: '5rem' }}
          animate={{ width: '10rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-auto z-30 h-28 sm:h-36 -translate-y-[4rem] sm:-translate-y-[6rem]
                     rounded-full bg-[#E8C882] blur-2xl"
        />

        {/* ── Hairline gold bar ── */}
        <motion.div
          initial={{ width: '8rem' }}
          animate={{ width: '18rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-auto z-50 h-0.5
                     -translate-y-[5rem] sm:-translate-y-[7rem]
                     bg-[#C9A96E] sm:w-[30rem]"
        />

        {/* ── Dark mask that hides the bottom of the beams ── */}
        <div className="absolute inset-auto z-40 h-36 sm:h-44 w-full
                        -translate-y-[8rem] sm:-translate-y-[12.5rem] bg-dp-bg" />
      </div>

      {/* ── Content slot ── */}
      <div className="relative z-50 flex -translate-y-52 sm:-translate-y-64 md:-translate-y-80
                      flex-col items-center px-5 w-full">
        {children}
      </div>
    </div>
  )
}
