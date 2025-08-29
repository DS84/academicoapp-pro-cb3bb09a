import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LayoutDashboard, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserDropdownProps {
  language: 'pt' | 'en';
  isAuthenticated: boolean;
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
  onLogout: () => void;
}

const UserDropdown = ({ language, isAuthenticated, user, onLogout }: UserDropdownProps) => {
  const translations = {
    pt: {
      profile: 'Perfil',
      settings: 'Configurações',
      dashboard: 'Dashboard',
      logout: 'Sair'
    },
    en: {
      profile: 'Profile',
      settings: 'Settings',
      dashboard: 'Dashboard',
      logout: 'Logout'
    }
  };

  const t = translations[language as keyof typeof translations];

  if (!isAuthenticated) {
    return null;
  }

  const userInitials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar} alt={user?.name || user?.email} />
            <AvatarFallback className="bg-accent text-accent-foreground">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium leading-none">{user?.name || 'Usuário'}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {user?.email}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>{t.profile}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>{t.dashboard}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/security-settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>{t.settings}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t.logout}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;