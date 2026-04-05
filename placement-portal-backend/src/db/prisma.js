import 'dotenv/config'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')

// Singleton pattern — one PrismaClient instance shared across the app.
// In dev the module can be hot-reloaded; re-creating the client every time
// would exhaust DB connections.  We store it on `globalThis` so it survives
// module reloads but is still garbage-collected when the process exits.

const globalForPrisma = globalThis

if (!globalForPrisma.__prisma) {
  const connectionString = process.env.DATABASE_URL
  const adapter = new PrismaPg(connectionString)

  globalForPrisma.__prisma = new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'production'
        ? ['error']
        : ['query', 'info', 'warn', 'error'],
  })
}

const prisma = globalForPrisma.__prisma

export default prisma
