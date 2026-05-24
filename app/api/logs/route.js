import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const logs = await prisma.requestLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { apiKey: true }
  })
  return Response.json(logs)
}

export async function POST(request) {
  const body = await request.json()
  const log = await prisma.requestLog.create({
    data: {
      ip: body.ip,
      endpoint: body.endpoint,
      method: body.method,
      status: body.status,
      latency: body.latency,
      apiKeyId: body.apiKeyId,
    }
  })
  return Response.json(log)
}