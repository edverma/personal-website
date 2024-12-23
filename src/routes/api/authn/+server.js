import { SECRET } from '$env/static/private';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const secret = request.headers.get('X-Secret');
    if (secret === SECRET) {
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    throw error(401, 'Unauthorized');
}