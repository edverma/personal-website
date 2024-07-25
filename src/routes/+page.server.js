import {postNames} from "../lib/posts.js";

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

const getDisplayName = (p => {
	const date = new Date(p);
	return date.toLocaleString('default', {month: 'long', day: 'numeric', year: 'numeric'})
});
