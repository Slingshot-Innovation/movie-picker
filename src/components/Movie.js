import { useState } from 'react'
import { PencilIcon, StarIcon as OutlineStarIcon } from '@heroicons/react/outline'
import { StarIcon as SolidStarIcon } from '@heroicons/react/solid'

export default function Movie({ movie, isWishlisted, onMovieUpdate, isWishlistDisabled }) {
    const [isEditing, setIsEditing] = useState(false)
    const [newYear, setNewYear] = useState('')
    const [newRating, setNewRating] = useState('')

    const toggleWishlist = async () => {
        const method = isWishlisted ? 'DELETE' : 'POST';
        try {
            const res = await fetch('/api/wishlist', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ movie_id: movie.id }),
            });
            if (!res.ok) throw new Error('Failed to update wishlist');
            onMovieUpdate({ ...movie, isWishlisted: !isWishlisted });
        } catch (error) {
            console.error('Error updating wishlist:', error);
        }
    };

    const handleUpdateYear = async () => {
        try {
            const res = await fetch(`/api/movies/${movie.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ year: parseInt(newYear) }),
            })

            if (res.ok) {
                const updatedMovie = await res.json();
                setIsEditing(false)
                setNewYear('')
                onMovieUpdate(updatedMovie)
            } else {
                console.error('Failed to update movie year')
            }
        } catch (error) {
            console.error('Error updating movie year:', error)
        }
    }

    const handleUpdateRating = async () => {
        try {
            let parsedRating = parseFloat(newRating)
            if (parsedRating > 10.0) parsedRating = 10.0
            if (parsedRating < 0.0) parsedRating = 0.0
            const roundedRating = Math.round(parsedRating * 10) / 10

            const res = await fetch(`/api/movies/${movie.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rating: roundedRating }),
            })

            if (res.ok) {
                const updatedMovie = await res.json();
                setIsEditing(false)
                setNewRating('')
                onMovieUpdate(updatedMovie)
            } else {
                console.error('Failed to update movie rating')
            }
        } catch (error) {
            console.error('Error updating movie rating:', error)
        }
    }

    return (
        <div className="bg-gray-100 p-4 rounded shadow relative">
            <button
                onClick={() => setIsEditing(!isEditing)}
                className="absolute top-2 right-8 text-gray-500 hover:text-gray-700"
            >
                <PencilIcon className="h-5 w-5" />
            </button>
            {!isWishlistDisabled && (
                <button
                    onClick={toggleWishlist}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    {isWishlisted ? (
                        <SolidStarIcon className="h-5 w-5 text-yellow-500" />
                    ) : (
                        <OutlineStarIcon className="h-5 w-5" />
                    )}
                </button>
            )}
            <h2 className="text-xl font-semibold">
                {movie.title} {movie.year !== 0 ? `(${movie.year})` : null}
            </h2>
            <p className="text-gray-600">Genres: {movie.genres.join(', ')}</p>
            <p className="text-gray-600 line-clamp-2">Actors: {movie.actors.join(', ')}</p>
            <p className="text-gray-600">
                Rating: {movie.rating !== null ? `${movie.rating.toFixed(1)}/10` : 'Unrated'}
            </p>
            {isEditing && (
                <div className="mt-2">
                    {movie.year === 0 && (
                        <div className="mb-2">
                            <input
                                type="number"
                                value={newYear}
                                onChange={(e) => setNewYear(e.target.value)}
                                placeholder="Enter year"
                                className="border rounded px-2 py-1"
                            />
                            <button
                                onClick={handleUpdateYear}
                                className="bg-green-500 text-white px-2 py-1 rounded ml-2"
                            >
                                Save
                            </button>
                        </div>
                    )}
                    <div>
                        <input
                            type="number"
                            step="0.1"
                            value={newRating}
                            onChange={(e) => setNewRating(e.target.value)}
                            placeholder="Enter rating"
                            className="border rounded px-2 py-1"
                        />
                        <button
                            onClick={handleUpdateRating}
                            className="bg-green-500 text-white px-2 py-1 rounded ml-2"
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
