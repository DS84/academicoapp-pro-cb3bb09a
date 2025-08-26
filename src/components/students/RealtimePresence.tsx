import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, Clock } from 'lucide-react';

interface RealtimePresenceProps {
  language: string;
  roomId: string;
  userProfile: any;
}

interface PresenceState {
  user_id: string;
  username: string;
  avatar_url?: string;
  status: 'online' | 'away' | 'studying';
  last_seen: string;
}

const RealtimePresence = ({ language, roomId, userProfile }: RealtimePresenceProps) => {
  const [presences, setPresences] = useState<Record<string, PresenceState[]>>({});
  const [currentUserStatus, setCurrentUserStatus] = useState<'online' | 'away' | 'studying'>('online');
  const { toast } = useToast();

  const t = {
    pt: {
      onlineUsers: 'Utilizadores Online',
      status: {
        online: 'Online',
        away: 'Ausente',
        studying: 'A Estudar'
      },
      userJoined: 'entrou na sessão',
      userLeft: 'saiu da sessão',
      changeStatus: 'Alterar Status'
    },
    en: {
      onlineUsers: 'Online Users',
      status: {
        online: 'Online',
        away: 'Away',
        studying: 'Studying'
      },
      userJoined: 'joined the session',
      userLeft: 'left the session',
      changeStatus: 'Change Status'
    }
  }[language as 'pt' | 'en'];

  useEffect(() => {
    if (!userProfile?.id || !roomId) return;

    const channel = supabase.channel(`presence_${roomId}`, {
      config: {
        presence: {
          key: userProfile.id,
        },
      },
    });

    // Listen to presence updates
    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState() as Record<string, PresenceState[]>;
        setPresences(newState);
        console.log('Presence sync:', newState);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
        if (key !== userProfile.id) {
          const user = newPresences[0];
          toast({
            title: `${user.username || 'Utilizador'} ${t.userJoined}`,
            duration: 3000,
          });
        }
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
        if (key !== userProfile.id) {
          const user = leftPresences[0];
          toast({
            title: `${user.username || 'Utilizador'} ${t.userLeft}`,
            duration: 3000,
          });
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track current user's presence
          const presenceTrackStatus = await channel.track({
            user_id: userProfile.id,
            username: userProfile.full_name || 'Utilizador',
            avatar_url: userProfile.avatar_url,
            status: currentUserStatus,
            last_seen: new Date().toISOString(),
          });
          console.log('Presence track status:', presenceTrackStatus);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userProfile?.id, roomId, currentUserStatus]);

  const updateStatus = async (newStatus: 'online' | 'away' | 'studying') => {
    setCurrentUserStatus(newStatus);
    
    // Update presence with new status
    const channel = supabase.channel(`presence_${roomId}`);
    await channel.track({
      user_id: userProfile.id,
      username: userProfile.full_name || 'Utilizador',
      avatar_url: userProfile.avatar_url,
      status: newStatus,
      last_seen: new Date().toISOString(),
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'studying': return 'bg-blue-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <MessageCircle className="h-3 w-3" />;
      case 'studying': return <Clock className="h-3 w-3" />;
      case 'away': return <Clock className="h-3 w-3" />;
      default: return <Users className="h-3 w-3" />;
    }
  };

  const allUsers = Object.values(presences).flat();
  const onlineCount = allUsers.length;

  return (
    <div className="space-y-4">
      {/* Online Users Count */}
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{t.onlineUsers}</span>
        <Badge variant="outline">{onlineCount}</Badge>
      </div>

      {/* Status Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.changeStatus}:</label>
        <div className="flex gap-2">
          {(['online', 'away', 'studying'] as const).map((status) => (
            <button
              key={status}
              onClick={() => updateStatus(status)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                currentUserStatus === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              {t.status[status]}
            </button>
          ))}
        </div>
      </div>

      {/* Online Users List */}
      {onlineCount > 0 && (
        <div className="space-y-2">
          {allUsers.map((user, index) => (
            <div key={`${user.user_id}-${index}`} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
              <div className="relative">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <Users className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`}>
                  <div className="w-full h-full rounded-full flex items-center justify-center text-white">
                    {getStatusIcon(user.status)}
                  </div>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.username}</p>
                <p className="text-xs text-muted-foreground">
                  {t.status[user.status as keyof typeof t.status]}
                </p>
              </div>
              
              {user.user_id === userProfile?.id && (
                <Badge variant="outline" className="text-xs">Você</Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RealtimePresence;