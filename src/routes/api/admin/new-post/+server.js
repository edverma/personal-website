import { SECRET } from '$env/static/private';
import { insertPost, getPostBySlug } from '$lib/server/db.ts';
import { json } from '@sveltejs/kit';
import { create_and_replace_content_image_links, get_header_image_markdown } from '$lib/server';
import { getSlug } from '$lib';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    try {
        const secret = request.headers.get('X-Secret');
        if (secret !== SECRET) {
            return json({ 
                success: false, 
                error: 'Invalid credentials' 
            }, { status: 401 });
        }

        const data = await request.json();
        const { title, tags, description, img_src, content } = data;

        // Validate required fields
        if (!title || !tags || !description || !content) {
            return json({ 
                success: false, 
                error: 'Missing required fields' 
            }, { status: 400 });
        }

        const slug = getSlug(title);
        let contentWithHeaderImage = content;
        let finalImgSrc = img_src;
        if (img_src) {
            const {headerImageLink, headerImageMarkdown} = await get_header_image_markdown(img_src, slug);
            finalImgSrc = headerImageLink;
            contentWithHeaderImage = headerImageMarkdown + content;
        }
        const processedContent = await create_and_replace_content_image_links(contentWithHeaderImage);

        await insertPost({
            title: title.trim(),
            tags: tags.trim(),
            description: description.trim(),
            slug,
            img_src: finalImgSrc?.trim() || '',
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