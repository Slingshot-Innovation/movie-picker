'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function TopBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('')

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearch(searchTerm)
        }
    }

    return (
        <div className="bg-gray-800 text-white py-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center px-4">
                <Link href="/" className="text-xl font-bold">
                    Flynn&apos;s Movies
                </Link>
                <div className="space-x-4 flex items-center">
                    <Link href="/wishlist" className="hover:underline">
                        Wishlist
                    </Link>
                    <Link href="/seen" className="hover:underline">
                        Seen
                    </Link>
                    <Link href="/add" className="hover:underline">
                        Add Movie
                    </Link>
                    <Link href="/recommend" className="hover:underline">
                        Get Recommendation
                    </Link>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Search movie or actor..."
                        className="px-2 py-1 rounded bg-gray-200 text-gray-700 focus:outline"
                    />
                </div>
            </div>
        </div>
    )
}
