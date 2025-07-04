let socket: WebSocket | null = null;

export function connectWebSocket(url: string) {
    socket = new WebSocket(url);
    return socket;
}

export function sendMessage(message: string) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
    }
}
