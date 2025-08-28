import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, Trash2 } from 'lucide-react';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  onAvatarUpdate?: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

const AvatarUpload = ({ currentAvatarUrl, onAvatarUpdate, size = 'md' }: AvatarUploadProps) => {
  const { user, updateProfile } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  };

  const getAvatarUrl = (path: string) => {
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    return data.publicUrl;
  };

  const uploadAvatar = async (file: File) => {
    if (!user) {
      toast.error('Utilizador não autenticado');
      return;
    }

    try {
      setUploading(true);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Por favor, selecione apenas ficheiros de imagem');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Ficheiro muito grande. Máximo 5MB');
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const avatarUrl = getAvatarUrl(uploadData.path);

      // Update user profile
      const { error: profileError } = await updateProfile({
        avatar_url: avatarUrl
      });

      if (profileError) {
        throw profileError;
      }

      onAvatarUpdate?.(avatarUrl);
      toast.success('Avatar atualizado com sucesso!');

    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao carregar avatar');
    } finally {
      setUploading(false);
    }
  };

  const deleteAvatar = async () => {
    if (!user || !currentAvatarUrl) {
      return;
    }

    try {
      setDeleting(true);

      // Extract path from URL
      const url = new URL(currentAvatarUrl);
      const path = url.pathname.split('/').slice(-2).join('/');

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([path]);

      if (deleteError) {
        throw deleteError;
      }

      // Update profile to remove avatar_url
      const { error: profileError } = await updateProfile({
        avatar_url: null
      });

      if (profileError) {
        throw profileError;
      }

      onAvatarUpdate?.('');
      toast.success('Avatar removido com sucesso!');

    } catch (error) {
      console.error('Error deleting avatar:', error);
      toast.error('Erro ao remover avatar');
    } finally {
      setDeleting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadAvatar(file);
    }
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const name = user.user_metadata?.full_name || user.email || '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={currentAvatarUrl} alt="Avatar" />
          <AvatarFallback className="text-sm font-medium">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
        
        {currentAvatarUrl && (
          <Button
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={deleteAvatar}
            disabled={deleting}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="flex flex-col items-center space-y-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {uploading ? 'A carregar...' : 'Carregar foto'}
        </Button>

        <Label className="text-xs text-muted-foreground text-center">
          Máximo 5MB. Formatos: JPG, PNG, GIF
        </Label>
      </div>
    </div>
  );
};

export default AvatarUpload;