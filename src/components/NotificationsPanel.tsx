import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, Bell, X } from 'lucide-react';
import { useNotificationStore } from '../store/notificationStore';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle size={16} className="text-amber-500" />;
      case 'info':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'reminder':
        return <Clock size={16} className="text-primary-500" />;
      default:
        return <Bell size={16} className="text-secondary-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end z-50">
      <motion.div
        initial={{ x: 300 }}
        animate={{ x: 0 }}
        exit={{ x: 300 }}
        className="w-full max-w-md h-full bg-white shadow-xl"
      >
        <div className="p-4 border-b border-secondary-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Notifications</h2>
            <p className="text-sm text-secondary-600">
              {notifications.filter(n => !n.read).length} unread notifications
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => markAllAsRead()}
              className="text-sm text-primary-500 hover:text-primary-600"
            >
              Mark all as read
            </button>
            <button
              onClick={onClose}
              className="text-secondary-500 hover:text-secondary-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-5rem)]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-secondary-600">
              No notifications
            </div>
          ) : (
            <div className="divide-y divide-secondary-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-secondary-50 transition-colors ${
                    !notification.read ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="ml-3 flex-grow">
                      <p className="text-secondary-900">{notification.message}</p>
                      <p className="text-xs text-secondary-500 mt-1">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-primary-500 hover:text-primary-600"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationsPanel;