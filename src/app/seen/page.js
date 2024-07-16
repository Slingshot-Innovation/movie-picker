'use client'

import { useState, useEffect } from 'react'
import TopBar from '@/components/TopBar'
import Movie from '@/components/Movie'

export default function SeenMovies() {
  const [seenMovies, setSeenMovies] = useState([])
  const [searchResults, setSearchResults] = useState([])

  const fetchSeenMovies = async () => {
    try {
      const res = await fetch(`/api/movies/seen`)
      if (!res.ok) {
        throw new Error('Failed to fetch seen movies')
      }
      const data = await res.json()
      setSeenMovies(data.movies)
    } catch (error) {
      console.error('Failed to fetch seen movies:', error)
    }
  }

  const handleSearch = async (term) => {
    if (term === '') {
      setSearchResults([])
      return
    }

    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(term)}`)
      if (!res.ok) {
        throw new Error('Failed to perform search')
      }
      const data = await res.json()
      setSearchResults(data.movies)
    } catch (error) {
      console.error('Failed to perform search:', error)
    }
  }

  const handleMovieUpdate = (updatedMovie) => {
    setSeenMovies(prevMovies =>
      prevMovies.map(movie =>
        movie.id === updatedMovie.id ? updatedMovie : movie
      )
    )
  }

  useEffect(() => {
    fetchSeenMovies()
  }, [])

  const sortedSeenMoviesToDisplay = [...seenMovies].sort((a, b) => b.rating - a.rating)
  const moviesToDisplay = searchResults.length > 0 ? searchResults : sortedSeenMoviesToDisplay

  return (
    <div>
      <TopBar onSearch={handleSearch} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Seen Movies ({seenMovies.length})</h1>
        {searchResults.length > 0 && (
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
        )}
        <ul className="space-y-4">
          {moviesToDisplay.map(movie => (
            <Movie
              key={movie.id}
              movie={movie}
              isWishlisted={false}
              onMovieUpdate={handleMovieUpdate}
              isWishlistDisabled={true}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}
