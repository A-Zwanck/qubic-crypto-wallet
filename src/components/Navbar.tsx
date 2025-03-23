
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, ChevronDown, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleLogout = async () => {
    try {
      // Sign out with Supabase
      await supabase.auth.signOut();
      
      // Close mobile menu if open
      setIsMobileMenuOpen(false);
      
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
  
  const isAuthenticated = !!user;
  
  return (
    <header className={cn("fixed top-0 w-full z-50 transition-all duration-300 py-4 px-4 md:px-8", isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent")}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
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
        <button className="md:hidden text-qubic-black/80 focus:outline-none" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={cn("fixed inset-0 bg-white z-40 flex flex-col pt-20 pb-6 px-4 transition-transform duration-300 ease-in-out md:hidden", isMobileMenuOpen ? "translate-x-0" : "translate-x-full")}>
        <nav className="flex flex-col space-y-4">
          {isAuthenticated ? (
            <>
              {user && (
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
              )}
              
              <Link 
                to="/wallet" 
                className={cn("text-lg py-2 border-b border-gray-100 text-qubic-black/80", location.pathname === '/wallet' && "text-qubic-blue font-medium")} 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Wallet
              </Link>
              <Link 
                to="/projects" 
                className={cn("text-lg py-2 border-b border-gray-100 text-qubic-black/80", location.pathname === '/projects' && "text-qubic-blue font-medium")} 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Proyectos DeFi
              </Link>
              <Link 
                to="/dashboard" 
                className={cn("text-lg py-2 border-b border-gray-100 text-qubic-black/80", location.pathname === '/dashboard' && "text-qubic-blue font-medium")} 
                onClick={() => setIsMobileMenuOpen(false)}
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
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Iniciar sesión
              </Link>
              <Link 
                to="/login" 
                className="btn-qubic w-full text-center" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Crear cuenta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
