import { getPosts } from "../../lib/server/db.ts";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {posts: await getPosts()}; 
}
