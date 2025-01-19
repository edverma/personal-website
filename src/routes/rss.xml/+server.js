import { getPosts } from '$lib/server/db.ts';
import { PUBLIC_BASE_URL } from '$env/static/public';
import marked from '$lib/marked';

export async function GET() {
    // Fetch your posts (adjust this based on your database structure)
    const posts = await getPosts([], true);
    posts.forEach(post => {
        post.content = marked(post.content);
    });
    
    // Create RSS feed XML
    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
        <rss version="2.0" 
             xmlns:atom="http://www.w3.org/2005/Atom"
             xmlns:content="http://purl.org/rss/1.0/modules/content/">
            <channel>
                <title>Evan's Weekly Newsletter</title>
                <description>Tech insights, software development, and personal updates from Evan.</description>
                <link>${PUBLIC_BASE_URL}</link>
                <language>en-us</language>
                <managingEditor>edverma@gmail.com</managingEditor>
                <webMaster>edverma@gmail.com</webMaster>
                <atom:link href="${PUBLIC_BASE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
                ${posts
                    .map(
                        (post) => `
                        <item>
                            <title>${escapeXml(post.title)}</title>
                            <link>${PUBLIC_BASE_URL}/${post.slug}</link>
                            <description>${escapeXml(post.description || '')}</description>
                            <author>edverma@gmail.com (Evan Verma)</author>
                            ${post.tags.map(tag => `<category>${tag}</category>`).join('')}
                            <pubDate>${toRFC822(new Date(post.created_at))}</pubDate>
                            <guid>${PUBLIC_BASE_URL}/${post.slug}</guid>
                            <content:encoded><![CDATA[${post.content}]]></content:encoded>

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

function toRFC822(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    const dateNum = date.getDate();
    const year = date.getFullYear();
    const time = date.toTimeString().slice(0, 8);
    const offset = date.toString().match(/[-+]\d{4}/)[0];
    
    return `${day}, ${dateNum} ${month} ${year} ${time} ${offset}`;
}
