import { MeshGradient } from '@paper-design/shaders-react'
import { useTheme } from '../../context/ThemeContext'

const LIGHT = {
  colors: ['#F5EDE0', '#ECE5D5', '#F0E8D8', '#FAF6EE'],
  backgroundColor: '#F7F4EF',
}

const DARK = {
  colors: ['#0D0A06', '#1A1108', '#150E05', '#231508'],
  backgroundColor: '#0D0A06',
}

export default function PremiumBg() {
  const { dark } = useTheme()
  const palette = dark ? DARK : LIGHT

  return (
    <div className="fixed inset-0 -z-10">
      <MeshGradient
        key={dark ? 'dark' : 'light'}
        style={{ width: '100%', height: '100%' }}
        colors={palette.colors}
        speed={0.2}
        seed={42}
        backgroundColor={palette.backgroundColor}
      />
    </div>
  )
}
