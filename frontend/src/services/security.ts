export type CheckStatus = 'assessed' | 'unavailable' | 'not-assessed'
export type StoredCheck = { status: CheckStatus; value?: string; score?: number; max?: number; updatedAt?: string; details?: string }
const stateKey = 'netshield-security-state'
export const securityState = {
  read: (): Record<string, StoredCheck> => { try { return JSON.parse(localStorage.getItem(stateKey) || '{}') } catch { return {} } },
  write: (key: string, value: StoredCheck) => { const next = securityState.read(); next[key] = value; localStorage.setItem(stateKey, JSON.stringify(next)); window.dispatchEvent(new Event('netshield-state')) },
}

export async function analyzeWebsite(url: string) {
  const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/website/analyze`
  try {
    const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload.error || 'The website could not be analyzed.')
    return payload as { url: string; status: number; https: boolean; redirected: boolean; headers: Record<string, string | null>; secureCookieIndicator: boolean | null; note: string; browserFallback?: boolean }
  } catch (error) {
    // GitHub Pages has no server runtime. A no-cors request provides a real
    // transport check while honestly leaving response headers unavailable.
    let parsed: URL
    try { parsed = new URL(url) } catch { throw error }
    if (!['http:', 'https:'].includes(parsed.protocol)) throw error
    try {
      await fetch(parsed.toString(), { method: 'GET', mode: 'no-cors', redirect: 'manual' })
      const headers = { 'content-security-policy': null, 'strict-transport-security': null, 'x-frame-options': null, 'x-content-type-options': null, 'referrer-policy': null, 'permissions-policy': null }
      return { url: parsed.toString(), status: 0, https: parsed.protocol === 'https:', redirected: false, headers, secureCookieIndicator: null, browserFallback: true, note: 'Browser-only fallback completed. The public site was reachable over transport, but response headers require the NetShield backend. No credentials or page content were read.' }
    } catch { throw new Error('The website could not be reached. Check the URL and try again.') }
  }
}

export async function fetchPublicIp() {
  const response = await fetch('https://api.ipify.org?format=json')
  if (!response.ok) throw new Error('Public IP service unavailable.')
  return (await response.json() as { ip: string }).ip
}
