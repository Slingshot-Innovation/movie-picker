import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server"
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });

  return response.data[0].embedding;
}

export async function POST(request) {
  const supabase = createClient();
  const { description } = await request.json();

  try {
    const embedding = await getEmbedding(description);

    // Query Supabase for similar movies
    const { data: movies, error } = await supabase.rpc('match_movies', {
      query_embedding: embedding,
      match_threshold: 0.78, // Adjust this value as needed
      match_count: 5, // Get top 5 matches
    });

    if (error) throw error;

    if (movies.length === 0) {
      return NextResponse.json({ message: "No similar movies found." }, { status: 404 });
    }

    // Fetch full movie details for the recommendations
    const { data: recommendations, error: fetchError } = await supabase
      .from('movies')
      .select(`
        *
      `)
      .in('id', movies.map(m => m.movie_id))
      .order('id', { ascending: false });

    if (fetchError) throw fetchError;

    // Format the recommendations
    const formattedRecommendations = recommendations.map(movie => ({
      ...movie
    }));

    return NextResponse.json({ recommendations: formattedRecommendations });
  } catch (error) {
    console.error('Error fetching movie recommendations:', error);
    return NextResponse.json({ message: "An error occurred while fetching recommendations." }, { status: 500 });
  }
}