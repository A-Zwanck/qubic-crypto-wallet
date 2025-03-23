
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { cn } from "@/lib/utils";
import UserMenu from './UserMenu';

interface MobileMenuProps {
  isOpen: boolean;
  user: any;
  handleLogout: () => Promise<void>;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, user, handleLogout, onClose }) => {
  const location = useLocation();

  return (
    <div className={cn("fixed inset-0 bg-white z-40 flex flex-col pt-20 pb-6 px-4 transition-transform duration-300 ease-in-out md:hidden", isOpen ? "translate-x-0" : "translate-x-full")}>
      <nav className="flex flex-col space-y-4">
        {user ? (
          <>
            <UserMenu user={user} isMobile={true} />
            
            <Link 
              to="/wallet" 
              className={cn("text-lg py-2 border-b border-gray-100 text-qubic-black/80", location.pathname === '/wallet' && "text-qubic-blue font-medium")} 
              onClick={onClose}
            >
              Wallet
            </Link>
            <Link 
              to="/projects" 
              className={cn("text-lg py-2 border-b border-gray-100 text-qubic-black/80", location.pathname === '/projects' && "text-qubic-blue font-medium")} 
              onClick={onClose}
            >
              Proyectos DeFi
            </Link>
            <Link 
              to="/dashboard" 
              className={cn("text-lg py-2 border-b border-gray-100 text-qubic-black/80", location.pathname === '/dashboard' && "text-qubic-blue font-medium")} 
              onClick={onClose}
            >
              Dashboard
            </Link>
            <button 
              onClick={handleLogout} 
              className="flex items-center text-lg py-2 text-qubic-black/80"
            >
              <LogOut size={18} className="mr-2" />
              <span>Cerrar sesión</span>
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className="btn-qubic-outline w-full text-center mb-2" 
              onClick={onClose}
            >
              Iniciar sesión
            </Link>
            <Link 
              to="/login" 
              className="btn-qubic w-full text-center" 
              onClick={onClose}
            >
              Crear cuenta
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default MobileMenu;
