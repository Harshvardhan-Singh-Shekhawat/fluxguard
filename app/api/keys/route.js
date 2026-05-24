export const dynamic = 'force-dynamic'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  const keys = await prisma.apiKey.findMany({
    orderBy: { createdAt: 'desc' },
    include: { logs: true }
  })
  return Response.json(keys)
}

export async function POST(request) {
  const body = await request.json()
  const key = await prisma.apiKey.create({
    data: {
      name: body.name,
      key: 'fg_live_' + Math.random().toString(36).substring(2, 15),
      tier: body.tier || 'free',
      limit: body.limit || 10000,
    }
  })
  return Response.json(key)
}