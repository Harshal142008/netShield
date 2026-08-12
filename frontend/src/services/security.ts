export type CheckStatus = 'assessed' | 'unavailable' | 'not-assessed'
export type StoredCheck = { status: CheckStatus; value?: string; score?: number; max?: number; updatedAt?: string; details?: string }
const stateKey = 'netshield-security-state'
export const securityState = {
  read: (): Record<string, StoredCheck> => { try { return JSON.parse(localStorage.getItem(stateKey) || '{}') } catch { return {} } },
  write: (key: string, value: StoredCheck) => { const next = securityState.read(); next[key] = value; localStorage.setItem(stateKey, JSON.stringify(next)); window.dispatchEvent(new Event('netshield-state')) },
}

export async function analyzeWebsite(url: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/website/analyze`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error || 'The website could not be analyzed.')
  return payload as { url: string; status: number; https: boolean; redirected: boolean; headers: Record<string, string | null>; secureCookieIndicator: boolean | null; note: string }
}

export async function fetchPublicIp() {
  const response = await fetch('https://api.ipify.org?format=json')
  if (!response.ok) throw new Error('Public IP service unavailable.')
  return (await response.json() as { ip: string }).ip
}
