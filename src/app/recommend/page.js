'use client'

import { useEffect, useState } from 'react'
import TopBar from '@/components/TopBar'
import Movie from '@/components/Movie'

export default function Recommend() {
    const [description, setDescription] = useState('')
    const [recommendations, setRecommendations] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [genres, setGenres] = useState([])
    const [wishlist, setWishlist] = useState([])
    const allGenres = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller']

    const handleGenreToggle = (genre) => {
        setGenres(prev =>
            prev.includes(genre)
                ? prev.filter(g => g !== genre)
                : [...prev, genre]
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setRecommendations([])
        setError(null)

        try {
            const res = await fetch(`/api/movies/recommend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description, genres }),
            })

            if (!res.ok) {
                throw new Error('Failed to fetch recommendations')
            }

            const data = await res.json()
            console.log(data.recommendations)
            setRecommendations(data.recommendations)
        } catch (error) {
            console.error('Error fetching recommendations:', error)
            setError('Failed to get recommendations. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleMovieUpdate = (updatedMovie) => {
        setRecommendations(prevMovies =>
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

    useEffect(() => {
        fetchWishlist()
    }, [])

    return (
        <div>
            <TopBar />
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <h1 className="text-3xl font-bold mb-6 text-center">Get Movie Recommendations</h1>
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        {/* <p className="font-semibold mb-2">Select genres:</p>
                        <div className="flex flex-wrap gap-2">
                            {allGenres.map(genre => (
                                <button
                                    key={genre}
                                    type="button"
                                    onClick={() => handleGenreToggle(genre)}
                                    className={`px-3 py-1 rounded ${genres.includes(genre)
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div> */}
                        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2 mt-4">
                            Describe the type of movie you want to watch:
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            rows="4"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
                        disabled={description.trim() === '' || loading}
                    >
                        {loading ? 'Getting Recommendations...' : 'Get Recommendations'}
                    </button>
                </form>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {recommendations.length > 0 && (
                    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <h2 className="text-2xl font-bold mb-4">Recommended Movies:</h2>
                        {recommendations.map((movie) => (
                            <Movie
                                key={movie.id}
                                movie={movie}
                                isWishlisted={wishlist?.some(item => item.movie_id === movie.id)}
                                onMovieUpdate={handleMovieUpdate}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}