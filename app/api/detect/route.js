export const dynamic = 'force-dynamic'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Z-score calculation
function calculateZScore(value, mean, stdDev) {
  if (stdDev === 0) return 0
  return Math.abs((value - mean) / stdDev)
}

function calculateMean(values) {
  if (values.length === 0) return 0
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

function calculateStdDev(values, mean) {
  if (values.length === 0) return 0
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2))
  return Math.sqrt(calculateMean(squaredDiffs))
}

export async function GET() {
  // Get last 100 logs for analysis
  const logs = await prisma.requestLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  if (logs.length < 10) {
    return Response.json({ 
      message: 'Not enough data for analysis. Need at least 10 requests.',
      anomalies: [] 
    })
  }

  // Extract latency values
  const latencies = logs.map(l => l.latency)
  const mean = calculateMean(latencies)
  const stdDev = calculateStdDev(latencies, mean)

  // Find anomalous requests (Z-score > 2)
  const anomalousLogs = logs.filter(log => {
    const zScore = calculateZScore(log.latency, mean, stdDev)
    return zScore > 2
  })

  // Count requests per IP
  const ipCounts = {}
  logs.forEach(log => {
    ipCounts[log.ip] = (ipCounts[log.ip] || 0) + 1
  })

  // Find IPs with abnormal request counts
  const ipCountValues = Object.values(ipCounts)
  const ipMean = calculateMean(ipCountValues)
  const ipStdDev = calculateStdDev(ipCountValues, ipMean)

  const suspiciousIPs = Object.entries(ipCounts)
    .filter(([ip, count]) => calculateZScore(count, ipMean, ipStdDev) > 2)
    .map(([ip, count]) => ({ ip, count, zScore: calculateZScore(count, ipMean, ipStdDev).toFixed(2) }))

  // Auto-create anomalies for suspicious IPs
  for (const suspicious of suspiciousIPs) {
    const existing = await prisma.anomaly.findFirst({
      where: { ip: suspicious.ip, type: 'Statistical Anomaly' }
    })

    if (!existing) {
      await prisma.anomaly.create({
        data: {
          type: 'Statistical Anomaly',
          ip: suspicious.ip,
          endpoint: '/multiple',
          requests: `${suspicious.count} req/window`,
          severity: suspicious.zScore > 3 ? 'High' : 'Medium',
          status: 'Flagged',
          description: `Z-score of ${suspicious.zScore} detected — IP behavior deviates significantly from baseline`,
        }
      })
    }
  }

  return Response.json({
    analysis: {
      totalRequests: logs.length,
      meanLatency: mean.toFixed(2),
      stdDevLatency: stdDev.toFixed(2),
      anomalousRequests: anomalousLogs.length,
      suspiciousIPs: suspiciousIPs,
    },
    anomalousLogs: anomalousLogs.slice(0, 10),
    message: `Analysis complete. Found ${anomalousLogs.length} latency anomalies and ${suspiciousIPs.length} suspicious IPs.`
  })
}