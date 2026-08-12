import { Router } from 'express'
import dns from 'node:dns/promises'
import net from 'node:net'
import { simpleRateLimit } from '../middleware/rateLimit.js'

export const websiteRouter = Router()
const MAX_BYTES = 256 * 1024
const TIMEOUT_MS = 8_000

function isPrivateAddress(address: string) {
  if (net.isIPv4(address)) {
    const [a, b] = address.split('.').map(Number)
    return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)
  }
  const value = address.toLowerCase()
  return value === '::1' || value.startsWith('fc') || value.startsWith('fd') || value.startsWith('fe80:') || value === '::'
}

async function validateTarget(raw: unknown) {
  if (typeof raw !== 'string' || raw.length > 2048) throw new Error('Enter a valid website URL.')
  let url: URL
  try { url = new URL(raw) } catch { throw new Error('Enter a valid website URL.') }
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only HTTP and HTTPS URLs are supported.')
  if (url.username || url.password) throw new Error('URLs containing credentials are not allowed.')
  if (url.port && !['80', '443'].includes(url.port)) throw new Error('Only standard HTTP and HTTPS ports are allowed.')
  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, '')
  if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.local') || hostname === 'metadata.google.internal' || hostname === '169.254.169.254') throw new Error('Private and internal targets are not allowed.')
  const addresses = net.isIP(hostname) ? [hostname] : await dns.lookup(hostname, { all: true }).then(records => records.map(record => record.address))
  if (!addresses.length || addresses.some(isPrivateAddress)) throw new Error('Private and internal targets are not allowed.')
  url.hash = ''
  return url
}

websiteRouter.post('/analyze', simpleRateLimit(), async (req, res) => {
  try {
    const url = await validateTarget(req.body?.url)
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    let response: Response
    try {
      response = await fetch(url, { method: 'GET', redirect: 'manual', signal: controller.signal, headers: { 'User-Agent': 'NetShield-Defensive-Analyzer/1.0', Accept: 'text/html,application/xhtml+xml' } })
    } finally { clearTimeout(timer) }
    const contentLength = Number(response.headers.get('content-length') || 0)
    if (contentLength > MAX_BYTES) {
      response.body?.cancel()
      throw new Error('The website response is too large to inspect safely.')
    }
    response.body?.cancel()
    const headers = Object.fromEntries(['content-security-policy', 'strict-transport-security', 'x-frame-options', 'x-content-type-options', 'referrer-policy', 'permissions-policy'].map(name => [name, response.headers.get(name)]))
    const setCookie = response.headers.get('set-cookie')
    res.json({ url: url.toString(), status: response.status, https: url.protocol === 'https:', redirected: response.status >= 300 && response.status < 400, headers, secureCookieIndicator: setCookie ? /\bsecure\b/i.test(setCookie) : null, note: 'Only publicly accessible response headers were assessed. No credentials or page content were submitted or stored.' })
  } catch (error) {
    const message = error instanceof Error && error.name === 'AbortError' ? 'The website took too long to respond.' : error instanceof Error ? error.message : 'The website could not be analyzed.'
    res.status(400).json({ error: message })
  }
})
