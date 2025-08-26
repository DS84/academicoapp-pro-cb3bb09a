import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';

interface RealtimeNotification {
  id: string;
  type: 'booking_update' | 'session_reminder' | 'payment_confirmed' | 'message';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: any;
}

interface RealtimeNotificationsProps {
  language: string;
  userId: string;
}

const RealtimeNotifications = ({ language, userId }: RealtimeNotificationsProps) => {
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const { toast } = useToast();

  const t = {
    pt: {
      notifications: 'Notificações',
      markAllRead: 'Marcar todas como lidas',
      noNotifications: 'Nenhuma notificação',
      types: {
        booking_update: 'Atualização de Reserva',
        session_reminder: 'Lembrete de Sessão',
        payment_confirmed: 'Pagamento Confirmado',
        message: 'Nova Mensagem'
      }
    },
    en: {
      notifications: 'Notifications',
      markAllRead: 'Mark all as read',
      noNotifications: 'No notifications',
      types: {
        booking_update: 'Booking Update',
        session_reminder: 'Session Reminder',
        payment_confirmed: 'Payment Confirmed',
        message: 'New Message'
      }
    }
  }[language as 'pt' | 'en'];

  useEffect(() => {
    if (!userId) return;

    // Listen to booking updates
    const bookingChannel = supabase
      .channel('booking-notifications')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter: `estudante_id=eq.${userId}`
        },
        (payload) => {
          console.log('Booking updated:', payload);
          
          const notification: RealtimeNotification = {
            id: `booking_${payload.new.id}_${Date.now()}`,
            type: 'booking_update',
            title: t.types.booking_update,
            message: `Status atualizado para: ${payload.new.status}`,
            timestamp: new Date().toISOString(),
            read: false,
            data: payload.new
          };
          
          addNotification(notification);
          
          toast({
            title: notification.title,
            description: notification.message,
          });
        }
      )
      .subscribe();

    // Listen to session reminders (mock implementation)
    const sessionChannel = supabase
      .channel('session-reminders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mentorship_sessions',
          filter: `student_id=eq.${userId}`
        },
        (payload) => {
          console.log('New session scheduled:', payload);
          
          const notification: RealtimeNotification = {
            id: `session_${payload.new.id}_${Date.now()}`,
            type: 'session_reminder',
            title: t.types.session_reminder,
            message: `Nova sessão agendada para ${new Date(payload.new.session_date).toLocaleDateString()}`,
            timestamp: new Date().toISOString(),
            read: false,
            data: payload.new
          };
          
          addNotification(notification);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(bookingChannel);
      supabase.removeChannel(sessionChannel);
    };
  }, [userId]);

  const addNotification = (notification: RealtimeNotification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 20)); // Keep last 20
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const removeNotification = (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking_update': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'session_reminder': return <Clock className="h-4 w-4 text-green-500" />;
      case 'payment_confirmed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'message': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMs = now.getTime() - notifTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
            variant="destructive"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <Card className="absolute right-0 top-12 w-80 max-h-96 overflow-hidden shadow-lg z-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{t.notifications}</CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    {t.markAllRead}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>{t.noNotifications}</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium truncate">
                            {notification.title}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealtimeNotifications;