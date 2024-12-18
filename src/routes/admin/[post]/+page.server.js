import { getPostBySlug, updatePost, setEmailSent, deletePost } from "$lib/server/db.ts";
import { redirect } from '@sveltejs/kit';
import { storeImages } from '$lib';
import marked from '$lib/marked';
import { SECRET } from '$env/static/private';
import { sendNewsletter } from '$lib/server/mailgun.js';

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
        const originalSlug = params.post;
        const slug = data.get('slug').trim();

        await updatePost(originalSlug, { title, tags, description, slug, img_src, content });

        return redirect(303, '/admin');
    },
    sendEmail: async ({ request, params }) => {
        const data = await request.formData();
        const reqSecret = data.get('secret');
        if (reqSecret !== SECRET) {
            throw new Error('Unauthorized');
        }
        const title = data.get('title').trim();
        const content = data.get('content');
        const slug = params.post;

        // TODO: use marked.js library to convert post content to html
        try {
            await sendNewsletter(title, marked(content));
            await setEmailSent(slug);
        } catch(err) {
            console.error(err);
            return { success: false, error: err.message };
        }
        
        return { success: true };
    },
    delete: async ({ request, params }) => {
        const data = await request.formData();
        const reqSecret = data.get('secret');
        if (reqSecret !== SECRET) {
            throw new Error('Unauthorized');
        }

        await deletePost(params.post);
        return redirect(303, '/admin');
    }
};