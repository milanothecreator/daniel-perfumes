export function GooeyLoader({ className = '', primaryColor, secondaryColor, borderColor }) {
  const style = {
    '--gooey-primary':   primaryColor   || '#8B5CF6',
    '--gooey-secondary': secondaryColor || '#4F46E5',
    '--gooey-border':    borderColor    || 'rgba(139,92,246,0.35)',
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={style} role="status" aria-label="Loading">
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="gooey-loader-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation={12} result="blur" />
            <feColorMatrix in="blur" mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 48 -7" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <style>{`
        .gooey-loader {
          width: 12em;
          height: 3em;
          position: relative;
          overflow: hidden;
          border-bottom: 8px solid var(--gooey-border);
          filter: url(#gooey-loader-filter);
        }
        .gooey-loader::before,
        .gooey-loader::after {
          content: '';
          position: absolute;
          border-radius: 50%;
        }
        .gooey-loader::before {
          width: 22em;
          height: 18em;
          background-color: var(--gooey-primary);
          left: -2em;
          bottom: -18em;
          animation: gooey-wee1 2s linear infinite;
        }
        .gooey-loader::after {
          width: 16em;
          height: 12em;
          background-color: var(--gooey-secondary);
          left: -4em;
          bottom: -12em;
          animation: gooey-wee2 2s linear infinite 0.75s;
        }
        @keyframes gooey-wee1 {
          0%   { transform: translateX(-10em) rotate(0deg); }
          100% { transform: translateX(7em)  rotate(180deg); }
        }
        @keyframes gooey-wee2 {
          0%   { transform: translateX(-8em) rotate(0deg); }
          100% { transform: translateX(8em)  rotate(180deg); }
        }
      `}</style>

      <div className="gooey-loader" />
    </div>
  )
}
