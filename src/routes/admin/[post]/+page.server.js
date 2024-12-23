import { getPostBySlug } from "$lib/server/db.ts";

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
