/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
    const authenticated = cookies.get('authenticated') === 'true';
    return { authenticated };
} 