import {postNames} from "../lib/posts.js";
import { SECRET } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	let posts = [];
	let i = 0;
	for (const p of postNames) {
		posts.push({id: i, name: p, displayName: getDisplayName(p)});
		i++;
	}
	return {posts}
}

export const actions = {
	authn: async({request}) => {
		const data = await request.formData();

		const reqSecret = data.get('secret')
		if (reqSecret === SECRET) {
			return {authn: true};
		}
		return {authn: false};
	}
};

const getDisplayName = (p => {
	const date = new Date(p);
	return date.toLocaleString('default', {month: 'long', day: 'numeric', year: 'numeric'})
});
