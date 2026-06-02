import { createContext, useContext, useState } from 'react'

const PrivacyContext = createContext(null)

const defaultPrivacy = {
  scentRecommendations: true,
  showSavedItems: true,
  showLocation: true,
  showOnlineStatus: true,
}

function loadPrivacy() {
  try { return JSON.parse(localStorage.getItem('dp_privacy')) } catch { return null }
}

export function PrivacyProvider({ children }) {
  const [prefs, setPrefs] = useState(() => ({ ...defaultPrivacy, ...loadPrivacy() }))

  function toggle(key) {
    setPrefs(p => {
      const next = { ...p, [key]: !p[key] }
      localStorage.setItem('dp_privacy', JSON.stringify(next))
      return next
    })
  }

  return (
    <PrivacyContext.Provider value={{ prefs, toggle }}>
      {children}
    </PrivacyContext.Provider>
  )
}

export function usePrivacy() { return useContext(PrivacyContext) }
