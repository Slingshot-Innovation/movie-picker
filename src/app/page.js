'use client'

import { useState, useEffect } from 'react'
import TopBar from '@/components/TopBar'
import Movie from '@/components/Movie'

export default function Home() {
  const [movies, setMovies] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [wishlist, setWishlist] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchMovies = async (pageNum) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/movies?page=${pageNum}&limit=20`)
      if (!res.ok) {
        throw new Error('Failed to fetch movies')
      }
      const data = await res.json()
      setMovies(prevMovies => pageNum === 1 ? data.movies : [...prevMovies, ...data.movies])
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Failed to fetch movies:', error)
      setError('Failed to fetch movies. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchWishlist = async () => {
    try {
      const res = await fetch(`/api/wishlist`)
      if (!res.ok) {
        throw new Error('Failed to fetch wishlist')
      }
      const data = await res.json()
      setWishlist(data)
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
    }
  }

  const handleSearch = async (term) => {
    setIsLoading(true)
    setError(null)
    if (term === '') {
      setSearchResults([])
      setPage(1)
      await fetchMovies(1)
      setIsLoading(false)
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
      setError('Failed to perform search. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMovieUpdate = (updatedMovie) => {
    setMovies(prevMovies =>
      prevMovies.map(movie =>
        movie.id === updatedMovie.id ? updatedMovie : movie
      )
    );

    if ('isWishlisted' in updatedMovie) {
      if (updatedMovie.isWishlisted) {
        setWishlist(prev => [...prev, { movie_id: updatedMovie.id }]);
      } else {
        setWishlist(prev => prev.filter(item => item.movie_id !== updatedMovie.id));
      }
    }
  }

  useEffect(() => {
    fetchMovies(1)
    fetchWishlist()
  }, [])

  return (
    <div>
      <TopBar onSearch={handleSearch} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Flynn's Movie Collection</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {isLoading && movies.length === 0 ? (
          <p className="text-center">Loading...</p>
        ) : (
          <>
            {searchResults.length > 0 ? (
              <>
                <h2 className="text-2xl font-bold mb-4">Movie search results</h2>
                <ul className="space-y-4">
                  {searchResults.map(movie => (
                    <Movie
                      key={movie.id}
                      movie={movie}
                      isWishlisted={wishlist?.some(item => item.movie_id === movie.id)}
                      onMovieUpdate={handleMovieUpdate}
                    />
                  ))}
                </ul>
              </>
            ) : (
              <>
                <ul className="space-y-4">
                  {movies.map(movie => (
                    <Movie
                      key={movie.id}
                      movie={movie}
                      isWishlisted={wishlist?.some(item => item.movie_id === movie.id)}
                      onMovieUpdate={handleMovieUpdate}
                    />
                  ))}
                </ul>
                {page < totalPages && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={() => {
                        setPage(prevPage => prevPage + 1)
                        fetchMovies(page + 1)
                      }}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Loading...' : 'Show Next 20'}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}