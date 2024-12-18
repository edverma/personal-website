import { getPosts } from "../../lib/server/db.ts";
import { SECRET } from "$env/static/private";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {posts: await getPosts()}; 
}

/** @type {import('./$types').Actions} */
export const actions = {
	authn: async({request}) => {
		const data = await request.formData();

		const reqSecret = data.get('secret');
		console.log('reqSecret', reqSecret);
		if (reqSecret === SECRET) {
            return {status: 200};
		}
        throw new Error('Unauthorized');
    }
};
