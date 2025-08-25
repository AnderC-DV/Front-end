import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, BASE_URL } from '../services/api';
import { NotificationContext } from './NotificationContextDefinition';
import { NotificationsSocket } from '../utils/NotificationsSocket';
import { useAuth } from './AuthContext'; // Assuming useAuth is in AuthContext.jsx

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingCount, setLoadingCount] = useState(true);
  const { getAccessToken } = useAuth();
  const socketRef = useRef(/** @type {NotificationsSocket | undefined} */ (undefined));

  const handleNewNotification = useCallback((msg) => {
    console.debug('[NotificationContext] Event received:', msg.event, msg.payload);
    if (msg.event === 'snapshot') {
      const list = msg.payload.slice().sort((a, b) => (new Date(a.created_at) < new Date(b.created_at) ? 1 : -1));
      setNotifications(list);
      console.debug('[NotificationContext] Snapshot applied. Count:', list.length);
      setLoading(false);
      setLoadingCount(false); // Snapshot provides initial data, so loading for count is done
    } else if (msg.event === 'notification.created') {
      setNotifications((prev) => {
        const existingIndex = prev.findIndex(n => n.id === msg.payload.id);
        if (existingIndex > -1) {
          // Replace existing notification if it's a duplicate (e.g., from snapshot and then created)
          const newNotifications = [...prev];
          newNotifications[existingIndex] = msg.payload;
          console.debug('[NotificationContext] Updated duplicate notification (created).');
          return newNotifications;
        }
        console.debug('[NotificationContext] New notification prepended.');
        return [msg.payload, ...prev];
      });
      setUnreadCount((prev) => prev + 1); // Optimistically increment unread count
    } else if (msg.event === 'notification.read') {
      setNotifications((prev) =>
        prev.map((n) => (n.id === msg.payload.id ? { ...n, is_read: true } : n))
      );
      console.debug('[NotificationContext] Marked as read (WS event):', msg.payload.id);
      setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0)); // Optimistically decrement unread count
    } else if (msg.event === 'unread_count.updated') {
      setUnreadCount(msg.payload.count);
      console.debug('[NotificationContext] Unread count updated:', msg.payload.count);
      setLoadingCount(false);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getNotifications();
      console.debug('[NotificationContext] REST fetch notifications count:', response.data?.length);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      console.debug('[NotificationContext] markAsRead called:', notificationId);
      await markNotificationAsRead(notificationId);
      // State will be updated by WebSocket 'notification.read' event
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      console.debug('[NotificationContext] markAllAsRead called');
      await markAllNotificationsAsRead();
      // State will be updated by WebSocket 'unread_count.updated' event
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, []);

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessToken();
      if (!token) {
        console.warn("No access token available for WebSocket connection.");
        return "";
      }
      return token;
    };

  console.debug('[NotificationContext] Initializing socket...');
  socketRef.current = new NotificationsSocket(getToken, handleNewNotification);
  socketRef.current.connect(BASE_URL);

    // Initial fetch of notifications in case WebSocket snapshot is delayed or fails
    fetchNotifications();

    return () => {
  console.debug('[NotificationContext] Cleaning up socket...');
  socketRef.current?.close();
    };
  }, [getAccessToken, handleNewNotification, fetchNotifications]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, loading, loadingCount, fetchNotifications, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
