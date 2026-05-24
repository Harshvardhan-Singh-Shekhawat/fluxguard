export const dynamic = 'force-dynamic'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(request, { params }) {
  const id = parseInt(params.id)
  
  await prisma.apiKey.update({
    where: { id },
    data: { isActive: false }
  })

  return Response.json({ message: 'Key revoked successfully' })
}