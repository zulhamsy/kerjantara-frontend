import { getBackendToken } from '../api/client';

const WS_URL = 'wss://kerjantara-backend-production.up.railway.app/ws';

let socket: WebSocket | null = null;
let reconnectTimer: any = null;

export function connectWS(onMessage: (msg: any) => void) {
  if (socket) return socket;

  const jwt = getBackendToken();
  if (!jwt) {
    console.error("No JWT for WebSocket");
    return null;
  }

  socket = new WebSocket(`${WS_URL}?token=${jwt}`);

  socket.onopen = () => {
    console.log("WS Connected");
    if (reconnectTimer) clearTimeout(reconnectTimer);
  };

  socket.onmessage = (ev) => {
    try {
      const msg = JSON.parse(ev.data);
      onMessage(msg);
    } catch (err) {
      console.error("WS Message Error:", err);
    }
  };

  socket.onclose = () => {
    console.log("WS Closed, reconnecting...");
    socket = null;
    reconnectTimer = setTimeout(() => connectWS(onMessage), 3000);
  };

  socket.onerror = (err) => {
    console.error("WS Error:", err);
    socket?.close();
  };

  return socket;
}

export function disconnectWS() {
  if (socket) {
    socket.close();
    socket = null;
  }
  if (reconnectTimer) clearTimeout(reconnectTimer);
}
