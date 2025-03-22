
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const toggleView = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!email.trim() || !password.trim()) {
      setError('Por favor, completa todos los campos');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, introduce un email válido');
      return;
    }
    
    // Password validation
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would authenticate with your backend here
      
      // Redirect to wallet page on success
      navigate('/wallet');
    } catch (err) {
      setError('Ha ocurrido un error. Por favor, inténtalo de nuevo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center px-4 md:px-12 py-12 relative">
        <Link to="/" className="absolute top-8 left-8 flex items-center text-qubic-gray-dark hover:text-qubic-blue transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          <span>Volver al inicio</span>
        </Link>
        
        <div className="max-w-md w-full mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-qubic-black">QUBIC WALLET</h1>
            <p className="text-qubic-gray-dark mt-1">
              {isLogin ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta sin comisiones'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Contraseña</Label>
                {isLogin && (
                  <Link to="/forgot-password" className="text-sm text-qubic-blue hover:underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isLogin ? 'Tu contraseña' : 'Crea una contraseña segura'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-qubic-gray-dark hover:text-qubic-black focus:outline-none"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-qubic-gray-dark text-xs mt-1">
                  Mínimo 8 caracteres. Usa números y caracteres especiales para mayor seguridad.
                </p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="btn-qubic w-full h-12"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cargando...
                </span>
              ) : (
                isLogin ? 'Iniciar sesión' : 'Crear cuenta'
              )}
            </Button>
          </form>
          
          <div className="text-center">
            <p className="text-qubic-gray-dark">
              {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
              <button
                type="button"
                onClick={toggleView}
                className="text-qubic-blue hover:underline font-medium ml-2"
              >
                {isLogin ? 'Regístrate' : 'Inicia sesión'}
              </button>
            </p>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mt-6">
            <p className="text-qubic-gray-dark text-xs text-center">
              Al crear una cuenta, aceptas nuestros <a href="#" className="text-qubic-blue hover:underline">Términos de servicio</a> y 
              <a href="#" className="text-qubic-blue hover:underline ml-1">Política de privacidad</a>.
            </p>
          </div>
        </div>
      </div>
      
      {/* Right Side - Image and Info */}
      <div className="hidden lg:block relative bg-qubic-blue overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&q=80')" }}
        ></div>
        
        <div className="relative h-full flex flex-col justify-center px-12 py-12 z-10">
          <div className="max-w-md mx-auto text-white space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Entra al mundo cripto sin comisiones</h2>
              <p className="text-white/80 text-lg">
                QUBIC WALLET te ofrece una experiencia única con la tecnología Qubic, 
                sin comisiones de red y con todas las herramientas que necesitas.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-white/10 rounded-full p-2 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Sin comisiones de red</h3>
                  <p className="text-white/70">
                    Realiza transferencias sin pagar comisiones gracias a la tecnología Qubic.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white/10 rounded-full p-2 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Seguridad avanzada</h3>
                  <p className="text-white/70">
                    Tus fondos están protegidos con la más alta tecnología de seguridad.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white/10 rounded-full p-2 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Soporte 24/7</h3>
                  <p className="text-white/70">
                    Asistencia en tiempo real por chat o email, siempre que lo necesites.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
