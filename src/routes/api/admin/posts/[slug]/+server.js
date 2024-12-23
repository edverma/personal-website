import { json } from '@sveltejs/kit';
import { updatePost, deletePost } from "$lib/server/db.ts";
import { SECRET } from '$env/static/private';
import { storeImages } from '$lib';

// PUT /api/posts/[slug]
export async function PUT({ request, params }) {
    try {
        const secret = request.headers.get('X-Secret');
        if (secret !== SECRET) {
            return new Response('Unauthorized', { status: 401 });
        }

        const { title, tags, description, img_src, content, slug } = await request.json();

        if (!title || !slug) {
            return json({ 
                success: false, 
                error: 'Title and slug are required' 
            }, { status: 400 });
        }

        const processedContent = await storeImages(content);
        await updatePost(params.slug, { 
            title: title.trim(),
            tags: Array.isArray(tags) ? tags.join(',') : (tags?.trim() || ''),
            description: description?.trim() || '',
            slug: slug.trim(),
            img_src: img_src?.trim() || '',
            content: processedContent
        });

        return json({ success: true });
    } catch (error) {
        console.error('Error updating post:', error);
        return json({ 
            success: false, 
            error: 'Failed to update post' 
        }, { status: 500 });
    }
}

// DELETE /api/posts/[slug]
export async function DELETE({ request, params }) {
    try {
        const secret = request.headers.get('X-Secret');
        
        if (secret !== SECRET) {
            return new Response('Unauthorized', { status: 401 });
        }

        if (!params.slug) {
            return json({ 
                success: false, 
                error: 'Post slug is required' 
            }, { status: 400 });
        }

        await deletePost(params.slug);
        return json({ success: true });
    } catch (error) {
        console.error('Error deleting post:', error);
        return json({ 
            success: false, 
            error: 'Failed to delete post' 
        }, { status: 500 });
    }
}