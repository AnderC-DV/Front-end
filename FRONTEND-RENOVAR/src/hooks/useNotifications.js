// import { useContext } from 'react';
// import { NotificationContext } from '../context/NotificationContextDefinition';

export const useNotifications = () => {
  // const context = useContext(NotificationContext);
  // if (context === undefined) {
  //   throw new Error('useNotifications must be used within a NotificationProvider');
  // }
  // return context;

  // Return a default, inactive state for the hook
  return {
    notifications: [],
    unreadCount: 0,
    loading: false,
    loadingCount: false,
    fetchNotifications: () => {},
    markAsRead: () => {},
  };
};
