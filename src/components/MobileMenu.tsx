
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetOverlay } from "@/components/ui/sheet";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onLogout: () => void;
}

const MobileMenu = ({ isOpen, onClose, user, onLogout }: MobileMenuProps) => {
  const location = useLocation();
  
  const handleLinkClick = () => {
    onClose();
  };
  
  const isAuthenticated = !!user;
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetOverlay className="mobile-menu-overlay" onClick={onClose} />
      <SheetContent side="right" className="p-0 mobile-menu">
        <div className="mobile-menu-wrapper pt-20 pb-6 px-4">
          <nav className="flex flex-col space-y-4">
            {isAuthenticated ? (
              <>
                {user && (
                  <div className="py-4 border-b border-gray-100 mb-2">
                    <div className="flex items-center">
                      <div className="bg-qubic-blue/10 rounded-full p-2 mr-3">
                        <User size={24} className="text-qubic-blue" />
                      </div>
                      <div className="truncate">
                        <div className="font-medium text-qubic-black truncate">{user.email}</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <Link 
                  to="/wallet" 
                  className={cn("text-lg py-2 border-b border-gray-100 text-qubic-black/80", location.pathname === '/wallet' && "text-qubic-blue font-medium")} 
                  onClick={handleLinkClick}
                >
                  Wallet
                </Link>
                <Link 
                  to="/projects" 
                  className={cn("text-lg py-2 border-b border-gray-100 text-qubic-black/80", location.pathname === '/projects' && "text-qubic-blue font-medium")} 
                  onClick={handleLinkClick}
                >
                  Proyectos DeFi
                </Link>
                <Link 
                  to="/dashboard" 
                  className={cn("text-lg py-2 border-b border-gray-100 text-qubic-black/80", location.pathname === '/dashboard' && "text-qubic-blue font-medium")} 
                  onClick={handleLinkClick}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={onLogout} 
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
                  onClick={handleLinkClick}
                >
                  Iniciar sesión
                </Link>
                <Link 
                  to="/login" 
                  className="btn-qubic w-full text-center" 
                  onClick={handleLinkClick}
                >
                  Crear cuenta
                </Link>
              </>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
