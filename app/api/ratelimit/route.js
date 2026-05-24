export const dynamic = 'force-dynamic'
import { prisma } from '../../lib/prisma'

// In-memory store for request counts
// Key: IP address, Value: { count, windowStart }
const requestStore = new Map()

const WINDOW_MS = 60 * 1000  // 1 minute window
const MAX_REQUESTS = 10       // max 10 requests per minute per IP

function checkRateLimit(ip) {
  const now = Date.now()
  const record = requestStore.get(ip)

  if (!record) {
    // First request from this IP
    requestStore.set(ip, { count: 1, windowStart: now })
    return { allowed: true, count: 1, remaining: MAX_REQUESTS - 1 }
  }

  const windowAge = now - record.windowStart

  if (windowAge > WINDOW_MS) {
    // Window expired — reset
    requestStore.set(ip, { count: 1, windowStart: now })
    return { allowed: true, count: 1, remaining: MAX_REQUESTS - 1 }
  }

  // Within window — increment
  record.count++

  if (record.count > MAX_REQUESTS) {
    return { allowed: false, count: record.count, remaining: 0 }
  }

  return { allowed: true, count: record.count, remaining: MAX_REQUESTS - record.count }
}

export async function POST(request) {
  const body = await request.json()
  const { ip, endpoint, method, apiKeyId } = body

  const result = checkRateLimit(ip)

  const status = result.allowed ? 'Allowed' : 'Blocked'
  const latency = Math.floor(Math.random() * 50) + 1

  // Log to database
  await prisma.requestLog.create({
    data: {
      ip,
      endpoint,
      method,
      status,
      latency,
      apiKeyId: apiKeyId || 1,
    }
  })

  // If blocked — check if anomaly (more than 3x limit)
  if (!result.allowed && result.count > MAX_REQUESTS * 3) {
    await prisma.anomaly.create({
      data: {
        type: 'DDoS Attempt',
        ip,
        endpoint,
        requests: `${result.count} req/min`,
        severity: 'Critical',
        status: 'Auto-Blocked',
        description: `IP ${ip} sent ${result.count} requests/min — ${Math.round(result.count/MAX_REQUESTS)}x above limit`,
      }
    })
  }

  return Response.json({
    allowed: result.allowed,
    count: result.count,
    remaining: result.remaining,
    status,
    message: result.allowed
      ? `Request allowed. ${result.remaining} requests remaining this minute.`
      : `Rate limit exceeded. Try again in 1 minute.`
  }, {
    status: result.allowed ? 200 : 429
  })
}