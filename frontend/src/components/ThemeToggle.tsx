import { Moon, Sun } from 'lucide-react'
export function ThemeToggle({ theme, toggle }: { theme: 'dark'|'light'; toggle: () => void }) { return <button className="icon-btn" onClick={toggle} aria-label="Toggle color theme">{theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}</button> }
