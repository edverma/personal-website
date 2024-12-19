import { getEventHash, getPublicKey, finalizeEvent } from 'nostr-tools';
import { SimplePool } from 'nostr-tools/pool';
import * as nip19 from 'nostr-tools/nip19'
import { NOSTR_RELAYS, NOSTR_SECRET_KEY } from '$env/static/private';

export const publishLongFormNote = async (contentMarkdown, title, imageUrl, summary, published_at, slug) => {
    const relayUrls = NOSTR_RELAYS.split(',').map(url => url.trim());
    let { type, data } = nip19.decode(NOSTR_SECRET_KEY)
    const nsec = data;
    const npub = getPublicKey(nsec);

    // Create a relay pool
    const pool = new SimplePool(relayUrls);

    // Build the NIP-23 event
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
        content: contentMarkdown.trim()
    };

    const signedEvent = finalizeEvent(event, nsec)

    // Publish the event
    try {
        await Promise.any(pool.publish(relayUrls, signedEvent))
        console.log('published to at least one relay!')
    } catch(err) {
        console.error('Error publishing event:', err);
        throw err;
    }
}