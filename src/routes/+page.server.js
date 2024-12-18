import { SECRET } from '$env/static/private';
import { getPostBySlug, getPosts } from "../lib/server/db.ts";
import { addMember } from '$lib/server/mailgun.js'

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const aboutPost = await getPostBySlug('about');
	return {posts: await getPosts(), aboutPost: aboutPost}; 
}

/** @type {import('./$types').Actions} */
export const actions = {
	subscribe: async ({ request }) => {
		const formData = await request.formData();
        const name = formData.get("name");
		const email = formData.get("email");

        try {
		    await addMember(name, email);
            return {
                success: true,
                message: "Successfully subscribed!"
            };
        } catch (err) {
            console.error(err);
            return {
                success: false,
                error: err.message || "Failed to subscribe. Please try again."
            };
        }
	}
}