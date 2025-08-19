import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { X, Mail, CheckCircle } from 'lucide-react';

const NotificationPanel = ({ onClose }) => {
  const { notifications, loading, markAsRead } = useNotifications();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'TEMPLATE_APPROVED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'TEMPLATE_REJECTED':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Mail className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl z-10 border border-gray-100">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Notificaciones</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <p className="p-6 text-center text-gray-500">Cargando...</p>
        ) : notifications.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No hay notificaciones nuevas.</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start p-4 border-b border-gray-100 transition-colors duration-200 ${
                !notification.is_read ? 'bg-blue-50 hover:bg-blue-100 cursor-pointer' : 'hover:bg-gray-50'
              }`}
              onClick={() => !notification.is_read && markAsRead(notification.id)}
            >
              <div className="mr-4">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-2 bg-gray-50 text-center border-t">
        <button className="text-sm text-blue-600 hover:underline">
          Ver todas las notificaciones
        </button>
      </div>
    </div>
  );
};

export default NotificationPanel;
