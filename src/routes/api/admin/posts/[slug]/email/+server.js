import { json } from '@sveltejs/kit';
import { setEmailSent } from "$lib/server/db.ts";
import { SECRET } from '$env/static/private';
import { sendNewsletter } from '$lib/server/mailgun.js';
import marked from '$lib/marked';

// POST /api/posts/[slug]/email
export async function POST({ request, params }) {
    const secret = request.headers.get('X-Secret');
    if (secret !== SECRET) {
        return new Response('Unauthorized', { status: 401 });
    }

    const { title, content } = await request.json();
    try {
        await sendNewsletter(title.trim(), marked(content));
        await setEmailSent(params.slug);
        return json({ success: true });
    } catch(err) {
        console.error(err);
        return json({ success: false, error: err.message }, { status: 500 });
    }
}