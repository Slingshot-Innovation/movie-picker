import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server"

export async function GET(request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 20;
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  try {
    // Fetch movies without actors
    const { data: movies, error, count } = await supabase
      .from('movies')
      .select('*', { count: 'exact' })
      .order('year', { ascending: false })
      .range(start, end);

    if (error) throw error;

    const totalPages = Math.ceil(count / limit);

    return NextResponse.json({ movies, totalMovies: count, totalPages });
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}

export async function POST(request) {
  const supabase = createClient();
  try {
    const { title, year, genres, actors } = await request.json();

    const { data: movie, error } = await supabase
      .from('movies')
      .insert({ title, year: parseInt(year), genres })
      .select()
      .single();

    if (error) throw error;

    for (const actorName of actors) {
      const { data: actor, error: actorError } = await supabase
        .from('actors')
        .upsert({ name: actorName })
        .select()
        .single();

      if (actorError) throw actorError;

      const { error: relationError } = await supabase
        .from('actors_in_movies')
        .insert({ actor_id: actor.id, movie_id: movie.id });

      if (relationError) throw relationError;
    }

    return NextResponse.json(movie, { status: 201 });
  } catch (error) {
    console.error('Error creating movie:', error);
    return NextResponse.json({ error: 'Failed to create movie' }, { status: 500 });
  }
}