import { useEffect, useState } from 'react'
export function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (localStorage.getItem('netshield-theme') as 'dark' | 'light') || 'dark')
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('netshield-theme', theme) }, [theme])
  return { theme, toggleTheme: () => setTheme(t => t === 'dark' ? 'light' : 'dark') }
}
