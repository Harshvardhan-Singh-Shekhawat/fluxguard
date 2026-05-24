const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Create API Keys
  const key1 = await prisma.apiKey.create({
    data: {
      name: 'Production App',
      key: 'fg_live_xK9mN3pQ7rS2tU5v',
      tier: 'enterprise',
      limit: 1000000,
    }
  })

  const key2 = await prisma.apiKey.create({
    data: {
      name: 'Staging Server',
      key: 'fg_live_pR2qL8wX4yZ6aB1c',
      tier: 'pro',
      limit: 500000,
    }
  })

  const key3 = await prisma.apiKey.create({
    data: {
      name: 'Mobile App',
      key: 'fg_live_tY5wX9kP2mN7qR3s',
      tier: 'pro',
      limit: 500000,
    }
  })

  // Create Request Logs
  const endpoints = ['/api/login', '/api/data', '/api/upload', '/api/auth']
  const methods = ['GET', 'POST']
  const statuses = ['Allowed', 'Allowed', 'Allowed', 'Blocked', 'Anomaly']
  const ips = ['192.168.1.1', '10.0.0.45', '172.16.0.8', '203.0.113.5', '198.51.100.2']

  for (let i = 0; i < 50; i++) {
    await prisma.requestLog.create({
      data: {
        ip: ips[Math.floor(Math.random() * ips.length)],
        endpoint: endpoints[Math.floor(Math.random() * endpoints.length)],
        method: methods[Math.floor(Math.random() * methods.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        latency: Math.floor(Math.random() * 100) + 1,
        apiKeyId: [key1.id, key2.id, key3.id][Math.floor(Math.random() * 3)],
      }
    })
  }

  // Create Anomalies
  await prisma.anomaly.create({
    data: {
      type: 'DDoS Attempt',
      ip: '192.168.1.1',
      endpoint: '/api/login',
      requests: '1,240 req/min',
      severity: 'Critical',
      status: 'Auto-Blocked',
      description: 'Single IP sending 1240 requests/min — 24x above normal threshold',
    }
  })

  await prisma.anomaly.create({
    data: {
      type: 'Brute Force',
      ip: '172.16.0.8',
      endpoint: '/api/auth',
      requests: '340 req/min',
      severity: 'High',
      status: 'Auto-Blocked',
      description: 'Repeated failed auth attempts detected from same IP',
    }
  })

  await prisma.anomaly.create({
    data: {
      type: 'Traffic Spike',
      ip: '198.51.100.2',
      endpoint: '/api/data',
      requests: '890 req/min',
      severity: 'Medium',
      status: 'Flagged',
      description: 'Sudden 8x traffic spike detected — possible scraping',
    }
  })

  console.log('Database seeded successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())