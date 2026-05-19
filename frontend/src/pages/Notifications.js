import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Button } from '../components/ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/notifications`, { withCredentials: true });
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`${BACKEND_URL}/api/notifications/${notificationId}/read`, {}, { withCredentials: true });
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-[#FF3B30]" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-[#34C759]" />;
      default:
        return <Info className="w-5 h-5 text-[#007AFF]" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#007AFF]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6" data-testid="notifications-page">
      {/* Header */}
      <div>
        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white mb-2" style={{ fontFamily: 'Chivo, sans-serif' }}>
          Notifications
        </h1>
        <p className="text-base text-[#A1A1AA]" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
          Stay updated with system alerts and updates
        </p>
      </div>

      {/* Notifications List */}
      <div className="max-w-3xl space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-[#121212] border border-white/10 rounded-md p-12 text-center">
            <Bell className="w-16 h-16 mx-auto mb-4 text-[#71717A]" />
            <p className="text-[#71717A]" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
              No notifications yet
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-[#121212] border rounded-md p-4 transition-colors duration-200 ${
                notification.read ? 'border-white/10' : 'border-[#007AFF]/30 bg-[#007AFF]/5'
              }`}
              data-testid="notification-item"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">{getIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white mb-1" style={{ fontFamily: 'Chivo, sans-serif' }}>
                    {notification.title}
                  </h3>
                  <p className="text-sm text-[#A1A1AA] mb-2" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-[#71717A]">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markAsRead(notification.id)}
                    className="bg-transparent border-white/20 text-white hover:bg-white/5"
                    data-testid="mark-read-button"
                  >
                    Mark Read
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
