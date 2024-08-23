'use client'

import { useState, useEffect } from 'react'
import TopBar from '@/components/TopBar'
import Movie from '@/components/Movie'

export default function Wishlist() {
    const [wishlistMovies, setWishlistMovies] = useState([])
    const [searchResults, setSearchResults] = useState([])

    const fetchWishlistMovies = async () => {
        try {
            const res = await fetch(`/api/wishlist`)
            if (!res.ok) {
                throw new Error('Failed to fetch wishlist')
            }
            const data = await res.json()
            setWishlistMovies(data.map(w => w.movies))
        } catch (error) {
            console.error('Failed to fetch wishlist:', error)
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
        setWishlistMovies(prevMovies => {
          if (updatedMovie.isWishlisted) {
            return prevMovies.map(movie =>
              movie.id === updatedMovie.id ? updatedMovie : movie
            )
          } else {
            return prevMovies.filter(movie => movie.id !== updatedMovie.id)
          }
        })
    }

    useEffect(() => {
        fetchWishlistMovies()
    }, [])

    const moviesToDisplay = searchResults.length > 0 ? searchResults : wishlistMovies

    return (
        <div>
            <TopBar onSearch={handleSearch} />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8 text-center">Flynn&apos;s Wishlist ({wishlistMovies.length})</h1>
                {searchResults.length > 0 && (
                    <h2 className="text-2xl font-bold mb-4">Search Results</h2>
                )}
                <ul className="space-y-4">
                    {moviesToDisplay.map(movie => (
                        <Movie
                            key={movie.id}
                            movie={movie}
                            isWishlisted={true}
                            onMovieUpdate={handleMovieUpdate}
                        />
                    ))}
                </ul>
            </div>
        </div>
    )
}