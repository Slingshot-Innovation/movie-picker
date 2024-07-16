import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server"

export async function PUT(request, { params }) {
    const supabase = createClient();
    const { id } = params;
    const { year, rating } = await request.json();

    const updateData = {};
    if (year !== undefined) {
        updateData.year = parseInt(year);
    }
    if (rating !== undefined) {
        let parsedRating = parseFloat(rating);
        if (parsedRating > 10.0) parsedRating = 10.0;
        if (parsedRating < 0.0) parsedRating = 0.0;
        updateData.rating = Math.round(parsedRating * 10) / 10;
    }

    try {
        const { data, error } = await supabase
            .from('movies')
            .update(updateData)
            .eq('id', id)
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error updating movie:', error);
        return NextResponse.json({ error: 'Failed to update movie' }, { status: 500 });
    }
}