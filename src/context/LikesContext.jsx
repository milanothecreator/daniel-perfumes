import { createContext, useContext, useState, useEffect } from 'react'

const LikesContext = createContext(null)

export function LikesProvider({ children }) {
  const [likedIds, setLikedIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('dp_likes') || '[]')) }
    catch { return new Set() }
  })

  useEffect(() => {
    localStorage.setItem('dp_likes', JSON.stringify([...likedIds]))
  }, [likedIds])

  function toggleLike(id) {
    setLikedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function isLiked(id) { return likedIds.has(id) }

  return (
    <LikesContext.Provider value={{ likedIds, toggleLike, isLiked, likedCount: likedIds.size }}>
      {children}
    </LikesContext.Provider>
  )
}

export function useLikes() { return useContext(LikesContext) }
