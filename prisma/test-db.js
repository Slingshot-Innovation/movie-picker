const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    const movies = await prisma.movie.findMany()
    console.log('Connected to the database successfully.')
    console.log('Movies:', movies)
  } catch (error) {
    console.error('Failed to connect to the database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()