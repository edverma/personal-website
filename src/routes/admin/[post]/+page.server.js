import { getPostBySlug, updatePost } from "$lib/server/db.ts";
import { redirect } from '@sveltejs/kit';
import { getSlug, storeImages } from '$lib';
import { SECRET } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {    
	const post = await getPostBySlug(params.post);
	if (!post) {
        console.log('post not found');
		return {
			status: 404,
			error: new Error('Post not found')
		};
	}

	return {post};
}

/** @type {import('./$types').Actions} */
export const actions = {
    update: async ({ request, params }) => {
        const data = await request.formData();
        const reqSecret = data.get('secret');
        if (reqSecret !== SECRET) {
            throw new Error('Unauthorized');
        }

        const title = data.get('title').trim();
        const tags = data.get('tags').trim();
        const description = data.get('description').trim();
        const img_src = data.get('img_src').trim();
        const content = await storeImages(data.get('content'));
        const slug = params.post;

        await updatePost({ title, tags, description, slug, img_src, content });

        return redirect(303, '/admin');
    }
};
