
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, ChevronDown, User } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile, useMobileMenu } from '@/hooks/use-mobile';
import MobileMenu from './MobileMenu';

const NavbarRefactored = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isOpen, toggleMenu, closeMenu } = useMobileMenu();
  const { toast } = useToast();

  // Check if user is authenticated
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleLogout = async () => {
    try {
      // Close mobile menu first
      closeMenu();
      
      // Get current session before closing it
      const { data: sessionData } = await supabase.auth.getSession();
      
      // Only try to sign out if there is an active session
      if (sessionData && sessionData.session) {
        await supabase.auth.signOut();
        
        // Show success toast
        toast({
          title: 'Sesión cerrada',
          description: 'Has cerrado sesión correctamente',
        });
        
        // Redirect to home page
        navigate('/');
      } else {
        // If no session, just redirect and show a message
        toast({
          title: 'Información',
          description: 'No hay una sesión activa para cerrar',
        });
        navigate('/');
      }
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error);
      
      // Check if error is for session not found and handle that case
      if (error?.name === 'AuthSessionMissingError') {
        // Simply redirect to home if no session
        toast({
          title: 'Información',
          description: 'Sesión no encontrada, redirigiendo al inicio',
        });
        navigate('/');
        return;
      }
      
      // For other errors, show a generic message
      toast({
        title: 'Error',
        description: 'Hubo un problema al cerrar la sesión',
        variant: 'destructive',
      });
    }
  };
  
  const isAuthenticated = !!user;
  
  return (
    <>
      <header className={cn("fixed top-0 w-full z-50 transition-all duration-300 py-4 px-4 md:px-8", isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent")}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <img src="/lovable-uploads/b03c2db2-fc71-4f87-adb6-a8bf8b75a9fd.png" alt="Qubic Logo" className="h-7 mr-2" />
            <span className="font-bold text-xl md:text-2xl text-qubic-blue">WALLET</span>
          </Link>

          {/* Desktop Navigation */}
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
              </>
            ) : (
              <>
                <Link to="/login" className="btn-qubic-outline">Iniciar sesión</Link>
                <Link to="/login" className="btn-qubic">Crear cuenta</Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-qubic-black/80 focus:outline-none p-2" 
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Component */}
      <MobileMenu 
        isOpen={isOpen} 
        onClose={closeMenu} 
        user={user} 
        onLogout={handleLogout} 
      />
    </>
  );
};

export default NavbarRefactored;
