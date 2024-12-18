import { getPosts } from "$lib/server/db.ts";
import { SECRET } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	const authenticated = cookies.get('authenticated') === 'true';
	if (authenticated) {
		return { posts: await getPosts() };
	} else {
		return {};
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	authn: async ({ request, cookies }) => {
		const data = await request.formData();
		const reqSecret = data.get('secret');
		console.log('Attempting authentication');
		if (reqSecret === SECRET) {
			cookies.set('authenticated', 'true', {
				httpOnly: true,
				path: '/',
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 // 1 day
			});
			console.log('Authentication successful');
			throw redirect(303, '/admin');
		}
		console.log('Authentication failed');
		return { error: 'Invalid secret' };
	},
	signout: async ({ cookies }) => {
		cookies.delete('authenticated', { path: '/' });
		throw redirect(303, '/admin');
	}
};

