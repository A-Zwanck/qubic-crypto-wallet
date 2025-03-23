
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import UserMenu from './UserMenu';

interface NavLinksProps {
  isAuthenticated: boolean;
  user: any;
}

const NavLinks: React.FC<NavLinksProps> = ({ isAuthenticated, user }) => {
  const location = useLocation();

  return (
    <nav className="hidden md:flex items-center space-x-6">
      {isAuthenticated ? (
        <>
          <Link to="/wallet" className={cn("text-qubic-black/80 hover:text-qubic-blue transition-colors", location.pathname === '/wallet' && "text-qubic-blue font-medium")}>
            Wallet
          </Link>
          <Link to="/projects" className={cn("text-qubic-black/80 hover:text-qubic-blue transition-colors", location.pathname === '/projects' && "text-qubic-blue font-medium")}>
            Proyectos DeFi
          </Link>
          <Link to="/dashboard" className={cn("text-qubic-black/80 hover:text-qubic-blue transition-colors", location.pathname === '/dashboard' && "text-qubic-blue font-medium")}>
            Dashboard
          </Link>
          <UserMenu user={user} />
        </>
      ) : (
        <>
          <Link to="/login" className="btn-qubic-outline">Iniciar sesión</Link>
          <Link to="/login" className="btn-qubic">Crear cuenta</Link>
        </>
      )}
    </nav>
  );
};

export default NavLinks;
