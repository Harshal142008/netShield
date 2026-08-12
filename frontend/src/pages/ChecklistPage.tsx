import { useEffect, useState } from 'react'
import { securityState } from '../services/security'

const recommendations = ['Use WPA2-AES or WPA3', 'Avoid open Wi-Fi networks for sensitive activity', 'Update router firmware', 'Change default router administrator credentials', 'Use a strong unique Wi-Fi password', 'Enable HTTPS where available', 'Keep browser and operating system updated', 'Review DNS settings', 'Enable firewall protections', 'Avoid sharing credentials']
const help = ['Modern encryption makes unauthorized access harder.', 'Open networks can expose traffic to nearby observers.', 'Firmware updates fix known router weaknesses.', 'Default credentials are widely known and easy to guess.', 'Unique passwords reduce reuse-related risk.', 'HTTPS encrypts web traffic in transit.', 'Updates include security fixes.', 'Review unexpected DNS changes.', 'Firewalls reduce unwanted inbound connections.', 'Never share passwords or one-time codes.']
const read = () => { try { return JSON.parse(localStorage.getItem('netshield-checklist') || '[]') as boolean[] } catch { return [] } }

export function ChecklistPage() {
  const [items, setItems] = useState<boolean[]>(() => { const saved = read(); return Array.from({ length: 10 }, (_, i) => saved[i] || false) })
  useEffect(() => {
    const sync = () => { const saved = read(); setItems(Array.from({ length: 10 }, (_, i) => saved[i] || false)) }
    window.addEventListener('storage', sync)
    window.addEventListener('netshield-checklist-sync', sync)
    return () => { window.removeEventListener('storage', sync); window.removeEventListener('netshield-checklist-sync', sync) }
  }, [])
  const save = (next: boolean[]) => {
    setItems(next)
    localStorage.setItem('netshield-checklist', JSON.stringify(next))
    securityState.write('checklist', { status: 'assessed', value: `${next.filter(Boolean).length}/10 complete`, score: Math.round(next.filter(Boolean).length / 10 * 15), max: 15, updatedAt: new Date().toISOString() })
    window.dispatchEvent(new Event('netshield-checklist-sync'))
  }
  const completed = items.filter(Boolean).length
  return <div className="page"><p className="eyebrow">SECURITY CHECKLIST</p><h1>Small steps, <em>stronger habits</em>.</h1><p className="page-lead">Use this checklist to record improvements in your own environment. Changes sync automatically across tabs and windows.</p><div className="check-progress"><strong>{completed}/10</strong><div className="meter"><i style={{ width: `${completed * 10}%` }}/></div><span>{completed * 10}% complete</span></div><div className="checklist">{recommendations.map((item, i) => <label className={items[i] ? 'check-item checked' : 'check-item'} key={item}><input type="checkbox" checked={items[i]} onChange={() => save(items.map((value, index) => index === i ? !value : value))}/><span><b>{item}</b><small>{help[i]}</small></span></label>)}</div><button className="button secondary" onClick={() => save(Array(10).fill(false))}>Reset checklist everywhere</button></div>
}
