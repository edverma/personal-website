import { json } from '@sveltejs/kit';
import { addMember } from '$lib/server/mailgun.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const data = await request.json();
    const { name, email } = data;

    try {
        await addMember(name, email);
        return json({
            success: true,
            message: "Successfully subscribed!"
        });
    } catch (err) {
        console.error(err);
        return json({
            success: false,
            error: err.message || "Failed to subscribe. Please try again."
        }, { status: 400 });
    }
}