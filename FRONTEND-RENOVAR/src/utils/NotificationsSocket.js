import { BASE_URL } from '../services/api'; // Assuming BASE_URL is exported from api.js

// Define NotificationItem and Events types based on instruccion.txt
/**
 * @typedef {object} NotificationItem
 * @property {string} id
 * @property {string} message
 * @property {string} type
 * @property {string | null} link_url
 * @property {boolean} is_read
 * @property {string} created_at // ISO-8601
 */

/**
 * @typedef {
 *   { event: 'snapshot', payload: NotificationItem[] } |
 *   { event: 'notification.created', payload: NotificationItem } |
 *   { event: 'notification.read', payload: { id: string, is_read: true } } |
 *   { event: 'unread_count.updated', payload: { count: number } } |
 *   { event: 'keepalive', payload: Record<string, never> }
 * } Events
 */

export class NotificationsSocket {
  /** @type {WebSocket | undefined} */
  ws;
  /** @type {number | undefined} */
  pingTimer;
  backoffMs = 1000;
  backoffMax = 30000;

  /**
   * @param {() => Promise<string> | string} getToken
   * @param {(e: Events) => void} onMessage
   */
  constructor(getToken, onMessage) {
    this.getToken = getToken;
    this.onMessage = onMessage;
  }

  /**
   * @param {string} baseUrl
   */
  async connect(baseUrl) {
    const token = await this.getToken();
    const url = `${baseUrl.replace('http', 'ws')}/api/v1/notifications/ws?token=${encodeURIComponent(token)}`;
    console.debug('[NotificationsSocket] Connecting...', { url });
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.debug('[NotificationsSocket] Opened connection');
      this.pingTimer = window.setInterval(() => this.ws?.readyState === 1 && this.ws.send('ping'), 30000);
      this.backoffMs = 1000;
    };

    this.ws.onmessage = (ev) => {
      if (ev.data !== 'pong') {
        console.debug('[NotificationsSocket] Message received raw:', ev.data);
      }
      try {
        /** @type {Events} */
        const msg = JSON.parse(ev.data);
        console.debug('[NotificationsSocket] Parsed message:', msg.event, msg.payload);
        this.onMessage(msg);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        /* ignore */
      }
    };

    this.ws.onclose = async (ev) => {
      console.warn('[NotificationsSocket] Closed', { code: ev.code, reason: ev.reason });
      if (this.pingTimer) clearInterval(this.pingTimer);
      // 4401 = token inválido/expirado; refrescar antes de reconectar
      if (ev.code === 4401) {
        console.log("WebSocket closed due to invalid token, refreshing token and reconnecting...");
        await this.getToken(); // Refresh token
      }
      await this.reconnect(baseUrl);
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.ws?.close();
    };
  }

  /**
   * @param {string} baseUrl
   */
  async reconnect(baseUrl) {
    await new Promise((r) => setTimeout(r, this.backoffMs));
    this.backoffMs = Math.min(this.backoffMs * 2, this.backoffMax);
  console.log(`[NotificationsSocket] Attempting reconnect with backoff=${this.backoffMs}ms`);
    this.connect(baseUrl);
  }

  close() {
  console.debug('[NotificationsSocket] Manual close invoked');
    if (this.pingTimer) clearInterval(this.pingTimer);
    this.ws?.close();
    this.ws = undefined;
  }
}
