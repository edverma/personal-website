import { SECRET } from '$env/static/private';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const data = await request.json();

    const { secret } = data;
    if (secret === SECRET) {
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    throw error(401, 'Unauthorized');
}