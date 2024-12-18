import { SECRET } from '$env/static/private';
import { getPostBySlug, getPosts, getTags } from "../lib/server/db.ts";
import { addMember } from '$lib/server/mailgun.js'

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {posts: await getPosts(), aboutPost: await getPostBySlug('about'), dbTags: await getTags()}; 
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