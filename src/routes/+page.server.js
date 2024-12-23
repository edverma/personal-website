import { SECRET } from '$env/static/private';
import { getPostBySlug, getPosts, getTags } from "../lib/server/db.ts";
import { addMember } from '$lib/server/mailgun.js'

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {posts: await getPosts(), aboutPost: await getPostBySlug('about'), dbTags: await getTags()}; 
}
