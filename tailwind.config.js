/** @type {import('tailwindcss').Config} */

const cssVar = (name) => ({ opacityValue }) =>
  opacityValue !== undefined
    ? `rgb(var(${name}) / ${opacityValue})`
    : `rgb(var(${name}))`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dp: {
          bg:             cssVar('--dp-bg'),
          card:           cssVar('--dp-card'),
          border:         cssVar('--dp-border'),
          gold:           cssVar('--dp-gold'),
          'gold-light':   cssVar('--dp-gold-light'),
          cream:          cssVar('--dp-cream'),
          muted:          cssVar('--dp-muted'),
          silver:         cssVar('--dp-silver'),
          'silver-light': cssVar('--dp-silver-light'),
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #9A7520 0%, #B8902A 50%, #9A7520 100%)',
      },
    },
  },
  plugins: [],
}
