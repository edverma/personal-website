import { getPostBySlug, updatePost, setEmailSent, deletePost } from "$lib/server/db.ts";
import { SECRET } from '$env/static/private';
import { redirect, error } from '@sveltejs/kit';
import { storeImages } from '$lib';
import marked from '$lib/marked';
import { sendNewsletter } from '$lib/server/mailgun.js';
import { getPosts } from "$lib/server/db.ts";

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, cookies }) {
	const authenticated = cookies.get('authenticated') === 'true';
	if (!authenticated) {
		throw redirect(303, '/admin');
	}

	const post = await getPostBySlug(params.post);
	if (!post) {
		throw error(404, 'Post not found');
	}

	return { post };
}

/** @type {import('./$types').Actions} */
export const actions = {
	update: async ({ request, params, cookies }) => {
		const authenticated = cookies.get('authenticated') === 'true';
		if (!authenticated) {
			throw redirect(303, '/admin');
		}

		const data = await request.formData();
		const title = data.get('title').trim();
		const tags = data.get('tags').trim();
		const description = data.get('description').trim();
		const img_src = data.get('img_src').trim();
		const content = await storeImages(data.get('content'));
		const slug = data.get('slug').trim();

		const originalSlug = params.post;

		await updatePost(originalSlug, { title, tags, description, slug, img_src, content });

		throw redirect(303, '/admin');
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