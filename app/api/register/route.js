export const dynamic = 'force-dynamic'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request) {
  const body = await request.json()
  const { name, email, password } = body

  if (!name || !email || !password) {
    return Response.json({ error: 'All fields required' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return Response.json({ error: 'Email already registered' }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword }
  })

  return Response.json({ message: 'Account created successfully', userId: user.id })
}