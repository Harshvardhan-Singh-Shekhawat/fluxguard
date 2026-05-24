export const dynamic = 'force-dynamic'
import { prisma } from '../../lib/prisma'

export async function GET() {
  const anomalies = await prisma.anomaly.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return Response.json(anomalies)
}

export async function POST(request) {
  const body = await request.json()
  const anomaly = await prisma.anomaly.create({
    data: {
      type: body.type,
      ip: body.ip,
      endpoint: body.endpoint,
      requests: body.requests,
      severity: body.severity,
      status: body.status,
      description: body.description,
    }
  })
  return Response.json(anomaly)
}