import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";

export async function GET(request) {
  const supabase = createClient({ 
    timeout: 10000 // Increase the timeout to 10 seconds (10000 ms)
  });

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  const offset = (page - 1) * limit;

  try {
    const { data: ratedMovies, error } = await supabase
      .from('ratings')
      .select(`
        rating,
        movie: movies(*)
      `)
      .order('rating', { ascending: false });

    if (error) throw error;

    // Combine movie data with rating and actors
    const movies = ratedMovies.map(ratedMovie => ({
      ...ratedMovie.movie,
      rating: ratedMovie.rating,
    }));

    return NextResponse.json({ movies });
  } catch (error) {
    console.error('Error fetching rated movies:', error);
    return NextResponse.json({ error: 'Failed to fetch rated movies' }, { status: 500 });
  }
}
