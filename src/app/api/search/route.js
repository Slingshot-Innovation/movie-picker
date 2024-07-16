import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server"

export async function GET(request) {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ movies: [], actors: [] });
    }

    try {
        const { data: movies, error: moviesError } = await supabase
        .from('movies')
        .select(`
          *,
          actors:actors_in_movies(
            actors(*)
          )
        `)
        .or(`title.ilike.%${query}%, genres.cs.{${query}}, actors_in_movies(actor(name.ilike.%${query}%))`);

        if (moviesError) throw moviesError;

        const { data: actors, error: actorsError } = await supabase
            .from('actors')
            .select(`
        *,
        movies:actors_in_movies(
          movies(*)
        )
      `)
            .ilike('name', `%${query}%`);

        if (actorsError) throw actorsError;

        // Sort movies by relevance (same as before)
        const sortedMovies = movies.sort((a, b) => {
            // ... (sorting logic remains the same)
        });

        return NextResponse.json({ movies: sortedMovies, actors });
    } catch (error) {
        console.error('Error searching:', error);
        return NextResponse.json({ error: 'Failed to perform search' }, { status: 500 });
    }
}