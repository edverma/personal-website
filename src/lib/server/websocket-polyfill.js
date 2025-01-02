// Only load `ws` at runtime on the server side.
if (typeof window === 'undefined') {
    const { WebSocket } = await import('ws');
    // Provide globalThis.WebSocket for Nostr libraries
    globalThis.WebSocket = WebSocket;
}