import { getPosts } from '$lib/server/db.ts';
import { BASE_URL } from '$env/static/private';

export async function GET() {
    // Fetch your posts (adjust this based on your database structure)
    const posts = await getPosts();
    
    // Create RSS feed XML
    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
        <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
            <channel>
                <title>Evan's Weekly Newsletter</title>
                <description>Tech insights, software development, and personal updates from Evan.</description>
                <link>${BASE_URL}</link>
                <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
                ${posts
                    .map(
                        (post) => `
                        <item>
                            <title>${escapeXml(post.title)}</title>
                            <link>${BASE_URL}/${post.slug}</link>
                            <description>${escapeXml(post.description || '')}</description>
                            <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
                            <guid>${BASE_URL}/${post.slug}</guid>
                        </item>
                    `
                    )
                    .join('')}
            </channel>
        </rss>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
}

// Helper function to escape XML special characters
function escapeXml(unsafe) {
    return unsafe
        .replace(/[<>&'"]/g, (c) => {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
            }
        });
} 