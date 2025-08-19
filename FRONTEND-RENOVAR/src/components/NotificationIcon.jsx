import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import NotificationPanel from './NotificationPanel';

const NotificationIcon = () => {
  const { unreadCount, fetchNotifications } = useNotifications();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleTogglePanel = () => {
    if (!isPanelOpen) {
      fetchNotifications();
    }
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <div className="relative">
      <button onClick={handleTogglePanel} className="relative">
        <Bell className="h-6 w-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </button>
      {isPanelOpen && <NotificationPanel onClose={() => setIsPanelOpen(false)} />}
    </div>
  );
};

export default NotificationIcon;
