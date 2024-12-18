import { SECRET } from '$env/static/private';
import { insertPost } from '$lib/server/db.ts';
import { redirect } from '@sveltejs/kit';
import { getSlug, storeImages } from '$lib';

/** @type {import('./$types').Actions} */
export const actions = {
    create: async ({ request, cookies }) => {
        const authenticated = cookies.get('authenticated') === 'true';
        if (!authenticated) {
            throw redirect(303, '/admin');
        }

        const data = await request.formData();
        const title = data.get('title').trim();
        const tags = data.get('tags').trim();
        const description = data.get('description').trim();
        const img_src = data.get('img_src').trim();
        const content = await storeImages(data.get('content'));
        const slug = getSlug(title);

        await insertPost({ title, tags, description, slug, img_src, content });

        throw redirect(303, '/admin');
    }
};
