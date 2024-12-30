import { finalizeEvent } from 'nostr-tools';
import { SimplePool } from 'nostr-tools/pool';
import * as nip19 from 'nostr-tools/nip19'
import { NOSTR_RELAYS, NOSTR_SECRET_KEY } from '$env/static/private';

const selfHostedRelayUrl = "wss://relay.evanverma.com"

export const publishLongFormNote = async (contentMarkdown, title, imageUrl, summary, published_at, slug) => {
    // Normalize markdown: split on double newlines to preserve paragraph structure
    const normalizedContent = contentMarkdown
        .split(/\n\n+/)  // Split on 2 or more newlines to handle multiple blank lines
        .map(paragraph => {
            // Preserve formatting for headers, lists, blockquotes, and code blocks
            if (paragraph.match(/^(#{1,6} |[*-]|\d+\.|>|\s{4}|\t|```)/m)) {
                return paragraph;
            }
            // For regular paragraphs, remove all line breaks
            return paragraph.replace(/\n/g, ' ').trim();
        })
        .join('\n\n')
        .trim();
    
    const relayUrls = NOSTR_RELAYS.split(',').map(url => url.trim());
    let { data } = nip19.decode(NOSTR_SECRET_KEY)
    const nsec = data;

    // Create a relay pool
    const pool = new SimplePool(relayUrls);

    const event = {
        kind: 30023,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
            ["title", title],
            ["summary", summary],
            ["published_at", Math.floor(new Date(published_at).getTime() / 1000).toString()],
            ["image", imageUrl],
            ["t", "article"],
            ["d", slug],
        ],
        content: normalizedContent
    };

    const signedEvent = finalizeEvent(event, nsec)

    // Publish the event to self hosted relay
    try {
        await Promise.any(pool.publish([selfHostedRelayUrl], signedEvent))
        console.log('published to at least one relay!')
    } catch(err) {
        console.error('Error publishing event:', err);
        throw err;
    }

    // Publish the event to other relays
    try {
        await Promise.any(pool.publish(relayUrls, signedEvent))
        console.log('published to at least one relay!')
    } catch(err) {
        console.error('Error publishing event:', err);
        throw err;
    }
}