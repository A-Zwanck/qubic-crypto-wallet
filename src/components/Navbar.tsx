
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Check if user is authenticated - this is a placeholder
  const isAuthenticated = location.pathname !== '/' && location.pathname !== '/login';

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

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 py-4 px-4 md:px-8",
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-qubic-black font-bold text-xl md:text-2xl">QUBIC WALLET</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <Link 
                to="/wallet" 
                className={cn(
                  "text-qubic-black/80 hover:text-qubic-blue transition-colors",
                  location.pathname === '/wallet' && "text-qubic-blue font-medium"
                )}
              >
                Wallet
              </Link>
              <Link 
                to="/projects" 
                className={cn(
                  "text-qubic-black/80 hover:text-qubic-blue transition-colors",
                  location.pathname === '/projects' && "text-qubic-blue font-medium"
                )}
              >
                Proyectos DeFi
              </Link>
              <Link 
                to="/dashboard" 
                className={cn(
                  "text-qubic-black/80 hover:text-qubic-blue transition-colors",
                  location.pathname === '/dashboard' && "text-qubic-blue font-medium"
                )}
              >
                Dashboard
              </Link>
              <div className="relative group">
                <button className="flex items-center space-x-1 text-qubic-black/80 hover:text-qubic-blue transition-colors">
                  <span>Mi Cuenta</span>
                  <ChevronDown size={16} />
                </button>
                <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        // Add logout functionality here
                        window.location.href = '/';
                      }}
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
          className="md:hidden text-qubic-black/80 focus:outline-none" 
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-0 bg-white z-40 flex flex-col pt-20 pb-6 px-4 transition-transform duration-300 ease-in-out md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="flex flex-col space-y-4">
          {isAuthenticated ? (
            <>
              <Link 
                to="/wallet" 
                className={cn(
                  "text-lg py-2 border-b border-gray-100 text-qubic-black/80",
                  location.pathname === '/wallet' && "text-qubic-blue font-medium"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Wallet
              </Link>
              <Link 
                to="/projects" 
                className={cn(
                  "text-lg py-2 border-b border-gray-100 text-qubic-black/80",
                  location.pathname === '/projects' && "text-qubic-blue font-medium"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Proyectos DeFi
              </Link>
              <Link 
                to="/dashboard" 
                className={cn(
                  "text-lg py-2 border-b border-gray-100 text-qubic-black/80",
                  location.pathname === '/dashboard' && "text-qubic-blue font-medium"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button 
                onClick={() => {
                  // Add logout functionality here
                  setIsMobileMenuOpen(false);
                  window.location.href = '/';
                }}
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
