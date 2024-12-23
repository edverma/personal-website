import { getPosts } from "../../lib/server/db.ts";
import { SECRET } from "$env/static/private";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {posts: await getPosts()}; 
}
