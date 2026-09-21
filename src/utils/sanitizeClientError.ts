const REDACTED = '[redacted]'
const DEFAULT_FALLBACK = 'Unable to complete that request.'

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g
const JWT_RE = /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g
const BEARER_RE = /\b(?:bearer|token)\s+[A-Za-z0-9._\-+/=]+/gi
const UUID_RE =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi
const SECRET_QUERY_RE =
  /(?:access_token|refresh_token|id_token|api[_-]?key|apikey|anon[_-]?key)\s*[:=]\s*[^&\s]+/gi
const LOCAL_PATH_RE =
  /(?:file:\/\/|(?:\/(?:Users|home|private|tmp|var)\/)|[A-Za-z]:\\)[^\s)]+/g

function extractMessage(input: unknown): string {
  if (typeof input === 'string') return input
  if (input instanceof Error) return input.message
  if (input && typeof input === 'object' && 'message' in input) {
    const message = (input as { message: unknown }).message
    if (typeof message === 'string') return message
  }
  return ''
}

function looksLikeDump(text: string): boolean {
  if (text.length > 180) return true
  if (text.includes('\n')) return true
  return /stack|localStorage|user_id|componentStack/i.test(text)
}

/** Strip emails, tokens, local paths, and stacks before showing a client toast. */
export function sanitizeClientError(
  input: unknown,
  fallback: string = DEFAULT_FALLBACK,
): string {
  const raw = extractMessage(input)
  if (!raw.trim()) return fallback

  const withoutStack = raw
    .split('\n')
    .filter((line) => !/^\s*at\s+/.test(line) && !/componentStack/i.test(line))
    .join(' ')

  const redacted = withoutStack
    .replace(EMAIL_RE, REDACTED)
    .replace(JWT_RE, REDACTED)
    .replace(BEARER_RE, REDACTED)
    .replace(UUID_RE, REDACTED)
    .replace(SECRET_QUERY_RE, REDACTED)
    .replace(LOCAL_PATH_RE, REDACTED)
    .replace(/\s+/g, ' ')
    .trim()

  if (!redacted || redacted.includes(REDACTED) || looksLikeDump(redacted)) return fallback
  return redacted.slice(0, 180)
}
