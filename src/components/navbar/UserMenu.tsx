
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown, User } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserMenuProps {
  user: any;
  isMobile?: boolean;
  onClose?: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, isMobile = false, onClose }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      // Sign out with Supabase
      await supabase.auth.signOut();
      
      // Close mobile menu if open
      if (onClose) onClose();
      
      // Show logout toast
      toast({
        title: 'Sesión cerrada',
        description: 'Has cerrado sesión correctamente',
      });
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast({
        title: 'Error',
        description: 'Hubo un problema al cerrar la sesión',
        variant: 'destructive',
      });
    }
  };

  if (isMobile) {
    return (
      <div className="py-4 border-b border-gray-100 mb-2">
        <div className="flex items-center">
          <div className="bg-qubic-blue/10 rounded-full p-2 mr-3">
            <User size={24} className="text-qubic-blue" />
          </div>
          <div>
            <div className="font-medium text-qubic-black">{user.email}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <button className="flex items-center space-x-1 text-qubic-black/80 hover:text-qubic-blue transition-colors">
        <span>{user?.email || 'Mi Cuenta'}</span>
        <ChevronDown size={16} />
      </button>
      <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
        <div className="py-1">
          <button 
            onClick={handleLogout} 
            className="flex items-center w-full px-4 py-2 text-sm text-left text-qubic-black/80 hover:text-qubic-blue hover:bg-gray-50"
          >
            <LogOut size={16} className="mr-2" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
