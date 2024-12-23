import { SECRET } from '$env/static/private';
import { insertPost } from '$lib/server/db.ts';
import { json } from '@sveltejs/kit';
import { getSlug, storeImages } from '$lib';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    try {
        const data = await request.json();
        const { secret, title, tags, description, img_src, content } = data;

        // Validate required fields
        if (!secret || !title || !tags || !description || !content) {
            return json({ 
                success: false, 
                error: 'Missing required fields' 
            }, { status: 400 });
        }

        if (secret !== SECRET) {
            return json({ 
                success: false, 
                error: 'Invalid credentials' 
            }, { status: 401 });
        }

        const processedContent = await storeImages(content);
        const slug = getSlug(title);

        await insertPost({
            title: title.trim(),
            tags: tags.trim(),
            description: description.trim(),
            slug,
            img_src: img_src?.trim() || '',
            content: processedContent
        });

        return json({ success: true, slug });
    } catch (error) {
        console.error('Error creating new post:', error);
        return json({ 
            success: false, 
            error: 'Internal server error' 
        }, { status: 500 });
    }
}