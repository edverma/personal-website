import { WebSocket } from 'ws';

// Ensure that we have a global WebSocket available, in case the environment is Node.
if (typeof globalThis !== 'undefined' && !globalThis.WebSocket) {
    globalThis.WebSocket = WebSocket;
}