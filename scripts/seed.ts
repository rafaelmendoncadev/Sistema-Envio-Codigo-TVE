import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Script de seed vazio por enquanto
  console.log('Seed executado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })