import { getEventHash, getPublicKey, finalizeEvent } from 'nostr-tools';
import { SimplePool } from 'nostr-tools/pool';
import * as nip19 from 'nostr-tools/nip19'
import { NOSTR_RELAYS, NOSTR_SECRET_KEY } from '$env/static/private';

export const publishLongFormNote = async (contentMarkdown, title, imageUrl, summary, published_at, slug) => {
    const relayUrls = NOSTR_RELAYS.split(',').map(url => url.trim());
    // Convert the hex string secret key to Uint8Array
    const secretKeyBytes = new Uint8Array(NOSTR_SECRET_KEY.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const nsec = secretKeyBytes;  // No need to encode as nsec since we'll use it directly
    const npub = getPublicKey(nsec);

    // Create a relay pool
    const pool = new SimplePool(relayUrls);

    try {
        let h = pool.subscribeMany(
            relayUrls,
            [
                {
                    authors: [npub],
                },
            ],
            {
                onevent(event) {
                    console.log('Event received:', event);
                },
                oneose() {
                    h.close()
                }
            }
        )
    } catch(err) {
        console.error('Error subscribing to relays:', err);
        throw err;
    }

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
        await Promise.all(pool.publish(relayUrls, signedEvent))
        console.log('published to all relays successfully!')
    } catch(err) {
        console.error('Error publishing event:', err);
        throw err;
    }
}