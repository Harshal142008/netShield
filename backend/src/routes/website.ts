import { Router } from 'express'
import dns from 'node:dns/promises'
import http from 'node:http'
import https from 'node:https'
import net from 'node:net'
import { simpleRateLimit } from '../middleware/rateLimit.js'

export const websiteRouter = Router()
const MAX_BYTES = 256 * 1024
const TIMEOUT_MS = 8_000

function isNonPublicAddress(address: string) {
  if (net.isIPv4(address)) {
    const [a, b] = address.split('.').map(Number)
    return a === 0 || a === 10 || a === 127 || a >= 224 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)
  }
  const value = address.toLowerCase()
  return value === '::' || value === '::1' || value.startsWith('::ffff:') || value.startsWith('fc') || value.startsWith('fd') || value.startsWith('fe80:')
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
  if (!addresses.length || addresses.some(isNonPublicAddress)) throw new Error('Private and internal targets are not allowed.')
  url.hash = ''
  return { url, address: addresses[0], family: net.isIP(addresses[0]) }
}

async function requestPublicHeaders(url: URL, address: string, family: number) {
  const client = url.protocol === 'https:' ? https : http
  return new Promise<http.IncomingMessage>((resolve, reject) => {
    const request = client.request(url, {
      method: 'GET',
      headers: { 'User-Agent': 'NetShield-Defensive-Analyzer/1.0', Accept: 'text/html,application/xhtml+xml' },
      // The hostname is validated once above. Supplying this lookup prevents a
      // second DNS resolution from redirecting the request to an internal host.
      lookup: (_hostname, options, callback) => {
        if (options.all) callback(null, [{ address, family }])
        else callback(null, address, family)
      },
    }, resolve)
    request.setTimeout(TIMEOUT_MS, () => request.destroy(new Error('The website took too long to respond.')))
    request.on('error', reject)
    request.end()
  })
}

websiteRouter.post('/analyze', simpleRateLimit(), async (req, res) => {
  try {
    const { url, address, family } = await validateTarget(req.body?.url)
    const response = await requestPublicHeaders(url, address, family)
    const contentLength = Number(response.headers['content-length'] || 0)
    if (contentLength > MAX_BYTES) {
      response.destroy()
      throw new Error('The website response is too large to inspect safely.')
    }
    response.destroy()
    const headers = Object.fromEntries(['content-security-policy', 'strict-transport-security', 'x-frame-options', 'x-content-type-options', 'referrer-policy', 'permissions-policy'].map(name => [name, response.headers[name] || null]))
    const setCookie = response.headers['set-cookie']
    const status = response.statusCode || 0
    res.json({ url: url.toString(), status, https: url.protocol === 'https:', redirected: status >= 300 && status < 400, headers, secureCookieIndicator: setCookie ? /\bsecure\b/i.test(setCookie.join('; ')) : null, note: 'Only publicly accessible response headers were assessed. No credentials or page content were submitted or stored.' })
  } catch (error) {
    const message = error instanceof Error && error.name === 'AbortError' ? 'The website took too long to respond.' : error instanceof Error ? error.message : 'The website could not be analyzed.'
    res.status(400).json({ error: message })
  }
})
