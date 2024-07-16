const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const movieData = [
  {
    title: "The Shawshank Redemption",
    year: 1994,
    genres: ["Drama"],
    actors: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"]
  },
  {
    title: "The Godfather",
    year: 1972,
    genres: ["Crime", "Drama"],
    actors: ["Marlon Brando", "Al Pacino", "James Caan"]
  },
  {
    title: "Pulp Fiction",
    year: 1994,
    genres: ["Crime", "Drama"],
    actors: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"]
  },
  {
    title: "The Dark Knight",
    year: 2008,
    genres: ["Action", "Crime", "Drama"],
    actors: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"]
  },
  {
    title: "Schindler's List",
    year: 1993,
    genres: ["Biography", "Drama", "History"],
    actors: ["Liam Neeson", "Ben Kingsley", "Ralph Fiennes"]
  },
  {
    title: "Forrest Gump",
    year: 1994,
    genres: ["Drama", "Romance"],
    actors: ["Tom Hanks", "Robin Wright", "Gary Sinise"]
  },
  {
    title: "Inception",
    year: 2010,
    genres: ["Action", "Adventure", "Sci-Fi"],
    actors: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"]
  },
  {
    title: "The Matrix",
    year: 1999,
    genres: ["Action", "Sci-Fi"],
    actors: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"]
  },
  {
    title: "Goodfellas",
    year: 1990,
    genres: ["Biography", "Crime", "Drama"],
    actors: ["Robert De Niro", "Ray Liotta", "Joe Pesci"]
  },
  {
    title: "The Silence of the Lambs",
    year: 1991,
    genres: ["Crime", "Drama", "Thriller"],
    actors: ["Jodie Foster", "Anthony Hopkins", "Scott Glenn"]
  }
];

async function main() {
  console.log(`Start seeding ...`)
  for (const movie of movieData) {
    const createdMovie = await prisma.movie.create({
      data: {
        title: movie.title,
        year: movie.year,
        genres: movie.genres,
        actors: {
          create: movie.actors.map(name => ({ name }))
        }
      },
    })
    console.log(`Created movie with id: ${createdMovie.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })