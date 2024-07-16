import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server"

export async function POST(request) {
    const supabase = createClient();
    const { movie_id } = await request.json();

    try {
        const { data, error } = await supabase
            .from('wishlist')
            .insert({ movie_id })
            .select();

        if (error) throw error;

        return NextResponse.json(data[0]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
    }
}

export async function DELETE(request) {
    const supabase = createClient();
    const { movie_id } = await request.json();

    try {
        const { error } = await supabase
            .from('wishlist')
            .delete()
            .match({ movie_id });

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
    }
}

export async function GET() {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from('wishlist')
            .select('*, movies(*)');

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
    }
}