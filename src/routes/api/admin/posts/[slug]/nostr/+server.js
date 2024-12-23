import { json } from '@sveltejs/kit';
import { SECRET } from '$env/static/private';
import { publishLongFormNote } from '$lib/server/nostr.js';

// POST /api/posts/[slug]/nostr
export async function POST({ request, params }) {
    const { secret, title, content, description, img_src, created_at } = await request.json();
    
    if (secret !== SECRET) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        await publishLongFormNote(
            content,
            title.trim(),
            img_src.trim(),
            description.trim(),
            created_at,
            params.slug
        );
        return json({ success: true });
    } catch(err) {
        console.error(err);
        return json({ success: false, error: err.message }, { status: 500 });
    }
}