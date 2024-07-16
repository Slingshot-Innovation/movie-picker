import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function getEmbedding(text) {
    const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text,
    });

    return response.data[0].embedding;
}

export async function GET(request) {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ movies: [] });
    }

    try {
        // Generate embedding for the search query
        const embedding = await getEmbedding(query);

        // Search movies using embedding similarity
        const { data: movies, error: moviesError } = await supabase.rpc('match_movies', {
            query_embedding: embedding,
            match_threshold: 0.78, // Adjust this threshold as needed
            match_count: 20 // Adjust the number of results as needed
        });

        if (moviesError) throw moviesError;

        console.log('Matched movies:', movies)

        // Fetch full movie details for the matched movies
        const { data: fullMovies, error: fullMoviesError } = await supabase
            .from('movies')
            .select(`
                *
            `)
            .in('id', movies.map(m => m.movie_id))
            .order('year', { ascending: false });

        if (fullMoviesError) throw fullMoviesError;

        // Combine similarity scores with full movie data
        const moviesWithSimilarity = fullMovies.map(movie => ({
            ...movie,
            similarity: movies.find(m => m.id === movie.id)?.similarity || 0,
        }));

        // Sort movies by similarity score
        const sortedMovies = moviesWithSimilarity.sort((a, b) => b.similarity - a.similarity);

        return NextResponse.json({ movies: sortedMovies });

    } catch (error) {
        console.error('Error searching:', error);
        return NextResponse.json({ error: 'Failed to perform search' }, { status: 500 });
    }
}