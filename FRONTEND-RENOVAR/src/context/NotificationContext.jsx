import React, { useState, useEffect, useCallback } from 'react';
import { getNotifications, getUnreadNotificationsCount, markNotificationAsRead } from '../services/api';
import { NotificationContext } from './NotificationContextDefinition';

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingCount, setLoadingCount] = useState(true); // New state for initial count loading

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    setLoadingCount(true);
    try {
      const response = await getUnreadNotificationsCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread notification count:', error);
    } finally {
      setLoadingCount(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId) => {
    // Optimistic UI update
    const originalNotifications = notifications;
    const originalUnreadCount = unreadCount;

    setNotifications(prevNotifications =>
      prevNotifications.map(n =>
        n.id === notificationId ? { ...n, is_read: true } : n
      )
    );
    setUnreadCount(prevCount => (prevCount > 0 ? prevCount - 1 : 0));

    try {
      await markNotificationAsRead(notificationId);
      // No need to call fetchUnreadCount, the state is already updated.
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Revert state if API call fails
      setNotifications(originalNotifications);
      setUnreadCount(originalUnreadCount);
    }
  }, [notifications, unreadCount]);

  useEffect(() => {
    // Non-blocking initial fetch for the unread count.
    const initialFetch = async () => {
      // Yield to the browser's main thread before fetching data
      await new Promise(resolve => setTimeout(resolve, 0));
      fetchUnreadCount();
    };

    initialFetch();

    // Poll for unread count every 30 seconds
    const intervalId = setInterval(fetchUnreadCount, 30000);

    // Clean up on component unmount
    return () => clearInterval(intervalId);
  }, [fetchUnreadCount]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, loading, loadingCount, fetchNotifications, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
