import { getPostBySlug, updatePost, setEmailSent, deletePost } from "$lib/server/db.ts";
import { redirect } from '@sveltejs/kit';
import { storeImages } from '$lib';
import marked from '$lib/marked';
import { SECRET } from '$env/static/private';
import { sendNewsletter } from '$lib/server/mailgun.js';
import { publishLongFormNote } from '$lib/server/nostr.js';

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
